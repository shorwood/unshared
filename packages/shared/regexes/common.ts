/** Matches valid lowercase slug */
export const slug = /^[a-z-]+$/

/** Matches email address. */
export const email = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\da-z\-]+\.)+[a-z]{2,}))$/i

/** Matches URL. */
export const url = /((([a-z]{3,9}:(?:\/\/)?)(?:[\w$&+,:;=\-]+@)?[\d.a-z\-]+|(?:www\.|[\w$&+,:;=\-]+@)[\d.a-z\-]+)((?:\/[\w%+./~\-]*)?\??[\w%&+.;=@\-]*#?[\w!./\\]*)?)/i

/** Matches MAC addresses */
export const mac = /^[\da-f]{2}(:[\da-f]{2}){5}$/i

/** Matches UUID */
export const uuid = /^(?:[\da-f]{8}-[\da-f]{4}-[1-5][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}|0{8}-(?:0{4}-){3}0{12})$/i

/** Matches IP v4 addresses */
export const ipv4 = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})$/

/** Matches IP v6 addresses */
export const ipv6 = /^(([\da-f]{1,4}:){7}[\da-f]{1,4}|([\da-f]{1,4}:){1,7}:|([\da-f]{1,4}:){1,6}:[\da-f]{1,4}|([\da-f]{1,4}:){1,5}(:[\da-f]{1,4}){1,2}|([\da-f]{1,4}:){1,4}(:[\da-f]{1,4}){1,3}|([\da-f]{1,4}:){1,3}(:[\da-f]{1,4}){1,4}|([\da-f]{1,4}:){1,2}(:[\da-f]{1,4}){1,5}|[\da-f]{1,4}:((:[\da-f]{1,4}){1,6})|:((:[\da-f]{1,4}){1,7}|:)|fe80:(:[\da-f]{0,4}){0,4}%[\da-z]+|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)\.){3}(25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)|([\da-f]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)\.){3}(25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d))$/i

/** Matches port number. */
export const port = /^((6553[0-5])|(655[0-2]\d)|(65[0-4]\d{2})|(6[0-4]\d{3})|([1-5]\d{4})|([0-5]{0,5})|(\d{1,4}))$/

/** Matches encoded JSON Web Token */
export const jwt = /^[\w=-]+\.[\w=-]+\.?[\w+./=-]*$/

/** Matches valid semantic versioning. */
export const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-z-][\da-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*))*))?(?:\+([\da-z-]+(?:\.[\da-z-]+)*))?$/i

/** Matches comma separeted latitude and longitude values. */
export const latLong = /^((-?|\+?)?\d+(\.\d+)?),\s*((-?|\+?)?\d+(\.\d+)?)$/

/** Matches date (and time) with dashes, slashes or with spaces (e.g. `dd-mm-yyyy` `dd/mm/yyyy` `dd mm yyyy`). */
export const dateTime = /^(0?[1-9]|[12]\d|3[01])([ /\-])(0?[1-9]|1[0-2])\2(\d{4})(([ -])([01]?\d|2[0-3])(?::[0-5]?\d){2})?$/

/** Matches a valid date and times in the ISO-8601 format, excludes durations. */
export const dateTimeIso8601 = /^(?![+-]?\d{4,5}-?(?:\d{2}|w\d{2})t)(?:|(\d{4}|[+-]\d{5})-?(?:|(0\d|1[0-2])(?:|-?([0-2]\d|3[01]))|([0-2]\d{2}|3[0-5]\d|36[0-6])|w([0-4]\d|5[0-3])(?:|-?([1-7])))(?:(?!\d)|t(?=\d)))(?:|([01]\d|2[0-4])(?:|:?([0-5]\d)(?:|:?([0-5]\d)(?:|\.(\d{3})))(?:|z|([+-](?:[01]\d|2[0-4]))(?:|:?([0-5]\d)))))$/i
