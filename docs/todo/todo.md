## String comparison

| Description | Example |
| --- | --- |
 Compute the entropy of a string using KeePass's algorithm | `entropy('foo')` |
 
| Compute the Levenshtein distance between two strings | `levenshteinDistance('foo', 'bar')` |
| Compute the Jaro-Winkler distance between two strings | `jaroWinklerDistance('foo', 'bar')` |
| Compute the Jaro distance between two strings | `jaroDistance('foo', 'bar')` |
| Compute the Hamming distance between two strings | `hammingDistance('foo', 'bar')` |
| Compute the Sørensen–Dice coefficient between two strings | `sorensenDiceCoefficient('foo', 'bar')` |
| Compute the Longest Common Subsequence between two strings | `longestCommonSubsequence('foo', 'bar')` |
| Compute the Longest Common Substring between two strings | `longestCommonSubstring('foo', 'bar')` |
| Compute the Longest Increasing Subsequence between two strings | `longestIncreasingSubsequence('foo', 'bar')` |
| Compute the Longest Repeating Subsequence between two strings | `longestRepeatingSubsequence('foo', 'bar')` |
| Compute the Longest Repeating Substring between two strings | `longestRepeatingSubstring('foo', 'bar')` |
| Compute the Longest Palindromic Subsequence between two strings | `longestPalindromicSubsequence('foo', 'bar')` |
| Compute the Longest Palindromic Substring between two strings | `longestPalindromicSubstring('foo', 'bar')` |


## String validation

| Description | Example |
| --- | --- |
| Checks if a string is a palindrome | `isPalindrome('foo')` |
| Checks if a string is a pangram | `isPangram('foo')` |

## String formatting

| Description | Example |
| --- | --- |
| Format a string | `format('foo %s', 'bar')` |
| Template a string | `template('foo ${bar}', { bar: 'baz' })` |
| Template a string with liquid | `liquid('foo {{bar}}', { bar: 'baz' })` |
| Template a string with mustache | `mustache('foo {{bar}}', { bar: 'baz' })` |
| Template a string with handlebars | `handlebars('foo {{bar}}', { bar: 'baz' })` |
| Template a string with ejs | `ejs('foo <%= bar %>', { bar: 'baz' })` |

## Magic numbers

| Description | Example |
| --- | --- |
| Get the golden ratio | `goldenRatio` |
| Get the golden angle | `goldenAngle` |
| Get the golden spiral | `goldenSpiral` |

## File validation

| Description | Example |
| --- | --- |
| Checks if a file exists | `fileExists('foo.png')` |
| Checks if a file is a directory | `isDirectory('foo.png')` |
| Checks if a file is a symbolic link | `isSymbolicLink('foo.png')` |
| Checks if a file is a file | `isFile('foo.png')` |
| Checks if a file is readable | `isFileReadable('foo.png')` |
| Checks if a file is writable | `isFileWritable('foo.png')` |
| Checks if a file is executable | `isFileExecutable('foo.png')` |
| Checks if a file is empty | `isFileEmpty('foo.png')` |
| Checks if a file is a regular file | `isFileRegular('foo.png')` |
| Checks if a file is a block device | `isFileBlockDevice('foo.png')` |
| Checks if a file is a character device | `isFileCharacterDevice('foo.png')` |
| Checks if a file is a FIFO | `isFileFIFO('foo.png')` |
| Checks if a file is a socket | `isFileSocket('foo.png')` |
| Get the size of a file | `getFileSize('foo.png')` |
| Get the last modified date of a file | `getFileLastModifiedDate('foo.png')` |
| Get the last accessed date of a file | `getFileLastAccessedDate('foo.png')` |
| Get the creation date of a file | `getFileCreationDate('foo.png')` |
| Get the owner of a file | `getFileOwner('foo.png')` |
| Get the group of a file | `getFileGroup('foo.png')` |
| Get the permissions of a file | `getFilePermissions('foo.png')` |
| Get the inode of a file | `getFileInode('foo.png')` |
| Get the number of hard links of a file | `getFileHardLinks('foo.png')` |
| Get the device identifier of a file | `getFileDeviceIdentifier('foo.png')` |
| Get the device type of a file | `getFileDeviceType('foo.png')` |
| Get the block size of a file | `getFileBlockSize('foo.png')` |
| Get the number of blocks of a file | `getFileNumberOfBlocks('foo.png')` |

## File manipulation

| Description | Example |
| --- | --- |
| List files with a glob or regex pattern | `glob('foo.*', { cwd: '/foo/bar' })` |
| List files with a glob or regex pattern | `glob(/foo\.\w+/g, { cwd: '/foo/bar' })` |

# System information

| Description | Example |
| --- | --- |
| Get the current user | `getCurrentUser()` |
| Get the current user's username | `getCurrentUserUsername()` |
| Get the current user's uid | `getCurrentUserUid()` |
| Get the current user's gid | `getCurrentUserGid()` |
| Get the current user's groups | `getCurrentUserGroups()` |
| Get the current user's shell | `getCurrentUserShell()` |
| Get the number of physical CPU cores | `getCpuPhysicalCores()` |
| Get the number of logical CPU cores | `getCpuLogicalCores()` |
| Get the ram size | `getRamSize()` |
| Get the total disk size | `getDiskSize()` |
| Get the free disk size | `getDiskFreeSize()` |


# Regular expressions

| Description | Example |
| --- | --- |
| Replace a string with a regular expression | `replace('foo', /foo/, 'bar', options)` |
| Replace in chains | `replace('foo', [[/foo/, 'bar'], [/bar/, 'baz']], options)` |
| Detect a regular expression | `detect('foo', [[/foo/, 'bar'], [/bar/, 'baz']])` |

# IPC
| Description | Example |
| --- | --- |
| Wraps all module function's in a worker thread | `workerize('lodash')` |
| Wraps a function in a worker thread | `workerize(() => { console.log('foo') })` |
| Wraps a function in a cluster | `clusterize(() => { console.log('foo') })` |
| Get the current thread id | `getThreadId()` |
| Get the current thread type | `getThreadType()` |
| Get the current thread name | `getThreadName()` |

## GPU acceleration

| Description | Example |
| --- | --- |
| Get the current GPU specifications | `getGpuSpecifications()` |
| Check if the current GPU supports WebGL | `isWebGLSupported()` |
| Compile and execute a WebGL shader | `webglShader('void main() { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }')` |
| Compile and execute a GLSL shader | `glslShader('void main() { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }')` |
| Compile and execute a GPU operation | `gpuOperation('void main() { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }')` |

# Network

| Description | Example |
| --- | --- |
| Get the current public IP address | `getPublicIPV4()` |
| Get the current public IP address | `getPublicIPV6()` |

| Resolve a domain name to an IP address | `dnsResolve('google.com')` |
| Resolve an IP address to a domain name | `dnsReverse('1.1.1.1')` |

| Get the current DNS servers | `getNameservers()` |
| Set the current DNS servers | `addNameserver('1.1.1.1')` |
| Set the current DNS servers | `removeNameserver('1.1.1.1')` |
| Set the current DNS servers | `setNameservers(['1.1.1.1'])` |
| Ping a host | `ping('google.com', [443, 80], { timeout: 1000 })` |

| Get IP address information (ISP, Host) | `describeIPV4('1.1.1.1')` |
| Get IP address information (ISP, Host) | `describeIPV6('2606:4700:4700::1111')` |

| Count possible IP address from a CIDR | `getSubnetSize('24')` |
| Count possible IP address from a CIDR | `getSubnetSize('1.1.1.1/24')` |
| Count possible IP address from a mask | `getSubnetSize('255.255.255.0')` |
| Count possible IP address from a CIDR | `getSubnetSize('2606:4700:4700::1111/64')` |
| Count possible IP address from a mask | `getSubnetSize('2606:4700:4700::1111', 'ffff:ffff:ffff:ffff::')` |

| Convert a CIDR to a mask | `cidrToMask('24')` |
| Convert a mask to a CIDR | `maskToCidr('255.255.255.0')` |

| Check if an IP address is in a subnet with CIDR | `isInSubnet('1.1.1.1/24')
| Check if an IP address is in a subnet with mask | `isInSubnet('1.1.1.1', '255.255.255.0')` |

| Get the current network interfaces | `describeNetworkInterfaces()` |
| Get the current network interfaces | `describeNetworkInterface('eth0')` |

| Scan ports | `scanPorts('google.com', 1, 1000)` |
| Scan services | `scanServices('google.com', 1, 1000)` |
| Enum of ports | `enum { FTP = 21, SSH = 22, SMTP = 25, HTTP = 80, HTTPS = 443 }` |
| Enum of services | `enum { FTP = 'ftp', SSH = 'ssh', SMTP = 'smtp', HTTP = 'http', HTTPS = 'https' }` |
| Enum of protocols | `enum { TCP = 'tcp', UDP = 'udp' }` |

| Enum of DNS record types | `enum { A = 'A', AAAA = 'AAAA', CNAME = 'CNAME', MX = 'MX', NS = 'NS', PTR = 'PTR', SOA = 'SOA', SRV = 'SRV', TXT = 'TXT' }` |
| List DNS records | `getDNSRecords('google.com')` |
| List DNS records | `getDNSRecords('google.com', 'A')` |

| Forge a request with a custom MAC address | `forgeRequest('https://google.com', '00:00:00:00:00:00')` |
| Forge a request with a custom IP address | `forgeRequest('https://google.com', '1.1.1.1')` |

| Get the current network speed | `getNetworkSpeed()` |

| Get the current routing table | `getRoutingTable()` |
| Get the current routing table | `getRoutingTable('ipv4')` |
| Get the current routing table | `getRoutingTable('ipv6')` |

# Crypto

| Description | Example |
| --- | --- |
| Generate UUID V1 | `randomUUIDV1()` |
| Generate UUID V4 | `randomUUIDV4()` |
| Generate UUID V5 | `randomUUIDV5()` |

# Audio

| Description | Example |
| --- | --- |
| Get the current audio devices | `getAudioDevices()` |
| Load a sound | `loadSound('https://example.com/sound.mp3')` |
| Play a sound | `playSound('https://example.com/sound.mp3', { volume: 0.5 })` |
| Play a sound from a buffer | `playSound(buffer, { volume: 0.5 })` |
| Play a sound from a stream | `playSound(stream, { volume: 0.5 })` |
| Play a sound from a function | `playSound(() => generateSineWave(440, 1), { volume: 0.5 })` |
| Play a sound from a stepped array | `playSound([440, 880, 440, 880], { volume: 0.5, loop: true })` |
| Get the current audio volume | `getAudioVolume()` |
| Set the current audio volume | `setAudioVolume(0.5)` |
| Get the current audio mute state | `getAudioMute()` |
| Set the current audio mute state | `setAudioMute(true)` |
| Record audio | `recordAudio({ duration: 1000 })` |
| Generate a sine wave | `generateSineWave(440, 1)` |
| Generate a square wave | `generateSquareWave(440, 1)` |
| Generate a sawtooth wave | `generateSawtoothWave(440, 1)` |
| Generate a triangle wave | `generateTriangleWave(440, 1)` |
| Generate a noise wave | `generateNoiseWave(440, 1)` |
| Generate a white noise wave | `generateWhiteNoiseWave(440, 1)` |
| Generate a pink noise wave | `generatePinkNoiseWave(440, 1)` |
| Generate a brown noise wave | `generateBrownNoiseWave(440, 1)` |

## Sound manipulation

| Amplify a sound | `amplifySound('https://example.com/sound.mp3', 2)` |
| Fade in a sound | `fadeInSound('https://example.com/sound.mp3', 1000)` |
| Fade out a sound | `fadeOutSound('https://example.com/sound.mp3', 1000)` |
| Equalize a sound | `equalizeSound('https://example.com/sound.mp3', 1000)` |
| Reverse a sound | `reverseSound('https://example.com/sound.mp3')` |
| Concatenate sounds | `concatenateSounds(['https://example.com/sound1.mp3', 'https://example.com/sound2.mp3'])` |
| Delay a sound | `delaySound('https://example.com/sound.mp3', 1000)` |
| Distort a sound | `distortSound('https://example.com/sound.mp3', 1000)` |
| Flanger a sound | `flangerSound('https://example.com/sound.mp3', 1000)` |
| Modulate a sound | `modulateSound('https://example.com/sound.mp3', 1000)` |
| Overdrive a sound | `overdriveSound('https://example.com/sound.mp3', 1000)` |
| Phaser a sound | `phaserSound('https://example.com/sound.mp3', 1000)` |
| Pitch shift a sound | `pitchShiftSound('https://example.com/sound.mp3', 1000)` |
| Reverb a sound | `reverbSound('https://example.com/sound.mp3', 1000)` |
| Tremolo a sound | `tremoloSound('https://example.com/sound, 1000)` |

## Sound visualization

| Description | Example |
| --- | --- |
| Get the current audio spectrum | `getAudioSpectrum()` |
| Get the current audio waveform | `getAudioWaveform()` |
| Get the current audio waveform | `getAudioWaveform({ type: 'float32' })` |

## Image manipulation

| Description | Example |
| --- | --- |
| Load an image | `loadImage('https://example.com/image.png')` |
| Resize an image | `resizeImage('https://example.com/image.png', 100, 100)` |

## Video manipulation

| Description | Example |
| --- | --- |
| Load a video | `loadVideo('https://example.com/video.mp4')` |
| Play a video | `playVideo('https://example.com/video.mp4')` |
| Play a video from a buffer | `playVideo(buffer)` |
| Play a video from a stream | `playVideo(stream)` |

# Printing

| Description | Example |
| --- | --- |
| Print a file | `printFile('https://example.com/file.pdf')` |
| List the available printers | `getPrinters()` |
| Get the current printer | `getCurrentPrinter()` |
| Set the current printer | `setCurrentPrinter('printer')` |

# Notifications

| Description | Example |
| --- | --- |
| Send a notification | `sendNotification('Hello world')` |
| Send a notification | `sendNotification('Hello world', { title: 'Hello' })` |
| Send a notification | `sendNotification('Hello world', { title: 'Hello', icon: 'https://example.com/icon.png' })` |

# Geolocation

| Description | Example |
| --- | --- |
| Get the current geolocation | `getGeolocation()` |
| Get the current geolocation | `getGeolocation({ timeout: 1000 })` |
| Get the current geolocation | `getGeolocation({ timeout: 1000, enableHighAccuracy: true })` |

# Clipboard

| Description | Example |
| --- | --- |
| Get the current clipboard text | `getClipboardText()` |
| Set the current clipboard text | `setClipboardText('Hello world')` |

# Accessibility

| Description | Example |
| --- | --- |
| Get the current accessibility state | `getAccessibilityState()` |
| Set the current accessibility state | `setAccessibilityState({ screenReaderEnabled: true })` |

# Keyboard

| Description | Example |
| --- | --- |
| Get the current keyboard state | `getKeyboardState()` |
| Set the current keyboard state | `setKeyboardState({ keyboardEnabled: true })` |
| Register a keyboard shortcut | `registerKeyboardShortcut('CommandOrControl+Shift+K', () => console.log('Hello world'))` |

# Mouse

| Description | Example |
| --- | --- |
| Get the current mouse state | `getMouseState()` |
| Set the current mouse state | `setMouseState({ mouseEnabled: true })` |

