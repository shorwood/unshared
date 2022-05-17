/** Matches username identifier for the VOIP application Discord. */
export const discordUsername = /^.{3,32}#\d{4}$/

/** Matches Bitcoin address. */
export const bitcoinAddress = /^(bc1|[13])[\dA-HJ-NP-Za-z]{25,39}$/

/** Matches valid Firestore document ID */
export const firestoreId = /^(?!\.\.?$)(?!.*__.*__)([^/]{1,1500})$/

/** Matches emojis. */
export const emoji = /(\u00A9|\u00AE|[\u2000-\u3300]|\uD83C[\uD000-\uDFFF]|\uD83D[\uD000-\uDFFF]|\uD83E[\uD000-\uDFFF])/
