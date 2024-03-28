
namespace
{
    const static int ZXCVBN_ESTIMATE_THRESHOLD = 256;
} // namespace

/***********************************************************************************/

PasswordHealth::PasswordHealth(const QString& pwd)
{
    auto entropy = 0.0;
    entropy += ZxcvbnMatch(pwd.left(ZXCVBN_ESTIMATE_THRESHOLD).toUtf8(), nullptr, nullptr);
    if (pwd.length() > ZXCVBN_ESTIMATE_THRESHOLD) {
        // Add the average entropy per character for any characters above the estimate threshold
        auto average = entropy / ZXCVBN_ESTIMATE_THRESHOLD;
        entropy += average * (pwd.length() - ZXCVBN_ESTIMATE_THRESHOLD);
    }
    init(entropy);
}

/***********************************************************************************/
double ZxcvbnMatch(const char *Pwd, const char *UserDict[], ZxcMatch_t **Info)
{
    int i, j;
    ZxcMatch_t *Zp;
    Node_t *Np;
    double e;
    int FullLen = strlen(Pwd);
    int Len = FullLen;
    const uint8_t *Passwd = (const uint8_t *)Pwd;
    uint8_t *RevPwd;
    /* Create the paths */
    Node_t *Nodes = MallocFn(Node_t, Len+2);
    memset(Nodes, 0, (Len+2) * sizeof *Nodes);
    i = Cardinality(Passwd, Len);
    e = log((double)i);

    /* Limit length used to full entropy estimation to prevent excessive calculation time */
    if (Len > ZXCVBN_DETAIL_LEN)
        Len = ZXCVBN_DETAIL_LEN;

    /* Do matching for all parts of the password */
    for(i = 0; i < Len; ++i)
    {
        int MaxLen = Len - i;
        /* Add all the 'paths' between groups of chars in the password, for current starting char */
        UserMatch(&(Nodes[i].Paths), UserDict, Passwd, i, MaxLen);
        DictionaryMatch(&(Nodes[i].Paths), Passwd, i, MaxLen);
        DateMatch(&(Nodes[i].Paths), Passwd, i, MaxLen);
        SpatialMatch(&(Nodes[i].Paths), Passwd, i, MaxLen);
        SequenceMatch(&(Nodes[i].Paths), Passwd, i, MaxLen);
        RepeatMatch(&(Nodes[i].Paths), Passwd, i, MaxLen);

        /* Initially set distance to nearly infinite */
        Nodes[i].Dist = DBL_MAX;
    }

    /* Reverse dictionary words check */
    RevPwd = MallocFn(uint8_t, Len+1);
    for(i = Len-1, j = 0; i >= 0; --i, ++j)
        RevPwd[j] = Pwd[i];
    RevPwd[j] = 0;
    for(i = 0; i < Len; ++i)
    {
        ZxcMatch_t *Path = 0;
        int MaxLen = Len - i;
        DictionaryMatch(&Path, RevPwd, i, MaxLen);
        UserMatch(&Path, UserDict, RevPwd, i, MaxLen);

        /* Now transfer any reverse matches to the normal results */
        while(Path)
        {
            ZxcMatch_t *Nxt = Path->Next;
            Path->Next = 0;
            Path->Begin = Len - (Path->Begin + Path->Length);
            AddResult(&(Nodes[Path->Begin].Paths), Path, MaxLen);
            Path = Nxt;
        }
    }

    /* Add a set of brute force matches. Start by getting all the start points and all */
    /* points at character position after end of the matches.  */
    memset(RevPwd, 0, Len+1);
    for(i = 0; i < Len; ++i)
    {
        ZxcMatch_t *Path = Nodes[i].Paths;
        while(Path)
        {
            RevPwd[Path->Begin] |= 1;
            RevPwd[Path->Begin + Path->Length] |= 2;
            Path = Path->Next;
        }
    }
    RevPwd[0] = 1;
    RevPwd[Len] = 2;

    /* Add the brute force matches */
    for(i = 0; i < Len; ++i)
    {
        int MaxLen = Len - i;
        int j;
        if (!RevPwd[i])
            continue;
        for(j = i+1; j <= Len; ++j)
        {
            if (RevPwd[j])
            {
                Zp = AllocMatch();
                Zp->Type = BRUTE_MATCH;
                Zp->Begin = i;
                Zp->Length = j - i;
                Zp->Entrpy = e * (j - i);
                AddResult(&(Nodes[i].Paths), Zp, MaxLen);
            }
        }
    }
    FreeFn(RevPwd);
    if (FullLen > Len)
    {
        /* Only the first MAX_DETAIL_LEN characters are used for full  entropy estimation, for */
        /* very long passwords the remainding characters are treated as being a incrementing */
        /* sequence. This will give a low (and safe) entropy value for them. */
        Nodes[Len].Dist = DBL_MAX;
        Zp = AllocMatch();
        Zp->Type = LONG_PWD_MATCH;
        Zp->Begin = Len;
        /* Length is negative as only one extra node to represent many extra characters */
        Zp->Length = Len - FullLen;
        Zp->Entrpy = log(2 * (FullLen - Len));
        AddResult(&(Nodes[i].Paths), Zp, FullLen - Len);
        ++Len;
    }
    /* End node has infinite distance/entropy, start node has 0 distance */
    Nodes[Len].Dist = DBL_MAX;
    Nodes[0].Dist = 0.0;

    /* Reduce the paths using Dijkstra's algorithm */
    for(i = 0; i < Len; ++i)
    {
        int j;
        double MinDist = DBL_MAX;
        int MinIdx = 0;
        /* Find the unvisited node with minimum distance or entropy */
        for(Np = Nodes, j = 0; j < Len; ++j, ++Np)
        {
            if (!Np->Visit && (Np->Dist < MinDist))
            {
                MinIdx = j;
                MinDist = Np->Dist;
            }
        }
        /* Mark the minimum distance node as visited */
        Np = Nodes + MinIdx;
        Np->Visit = 1;
        e = Np->Dist;
        /* Update all unvisited neighbouring nodes with their new distance. A node is a */
        /* neighbour if there is a path/match from current node Np to it. The neighbour */
        /* distance is the current node distance plus the path distance/entropy. Only */
        /* update if the new distance is smaller. */
        for(Zp = Np->Paths; Zp; Zp = Zp->Next)
        {
            Node_t *Ep;
            double d = e + Zp->MltEnpy;
            if (Zp->Length >= 0)
                Ep = Np + Zp->Length;
            else
                Ep = Np + 1;
            if (!Ep->Visit &&  (d < Ep->Dist))
            {
                /* Update as lower dist, also remember the 'from' node */
                Ep->Dist = d;
                Ep->From = Zp;
            }
        }
    }
    /* Make e hold entropy result and adjust to log base 2 */
    e = Nodes[Len].Dist / log(2.0);

    if (Info)
    {
        /* Construct info on password parts */
        *Info = 0;
        for(Zp = Nodes[Len].From; Zp; )
        {
            ZxcMatch_t *Xp;
            i = Zp->Begin;

            /* Remove all but required path */
            Xp = Nodes[i].Paths;
            Nodes[i].Paths = 0;
            while(Xp)
            {
                ZxcMatch_t *p = Xp->Next;
                if (Xp == Zp)
                {
                    /* Adjust the entropy to log to base 2 */
                    Xp->Entrpy /= log(2.0);
                    Xp->MltEnpy /= log(2.0);
                    if (Xp->Length < 0)
                        Xp->Length = -Xp->Length;

                    /* Put previous part at head of info list */
                    Xp->Next = *Info;
                    *Info = Xp;
                }
                else
                {
                    /* Not going on info list, so free it */
                    FreeFn(Xp);
                }
                Xp = p;
            }
            Zp = Nodes[i].From;
        }
    }
    /* Free all paths. Any being returned to caller have already been freed */
    for(i = 0; i <= Len; ++i)
    {
        Zp = Nodes[i].Paths;
        while(Zp)
        {
            ZxcMatch_t *p = Zp->Next;
            FreeFn(Zp);
            Zp = p;
        }
    }
    FreeFn(Nodes);
    return e;
}