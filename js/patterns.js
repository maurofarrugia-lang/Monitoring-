export const ANONYMISATION_PATTERNS = [
  String.raw`Passport\\s*(?:No\\.?|Number|#)?\\s*[:\\-]?\\s*[A-Z0-9][A-Z0-9<\\-\\s]{3,24}`,
  String.raw`(?:National\\s+)?ID\\s*(?:No\\.?|Number|#)?\\s*[:\\-]?\\s*[A-Z0-9][A-Z0-9\\-\\/]{3,24}`,
  String.raw`Police\\s*(?:No\\.?|Number|#)?\\s*[:\\-]?\\s*[A-Z0-9][A-Z0-9\\-\\/]{2,24}`,
  String.raw`Ref\\s*Com\\s*(?:No\\.?|Number|#)?\\s*[:\\-]?\\s*[A-Z0-9][A-Z0-9\\-\\/]{2,24}`,
  String.raw`Application\\s*(?:No\\.?|Number|Reference|#)?\\s*[:\\-]?\\s*[A-Z0-9][A-Z0-9\\-\\/]{2,30}`,
  String.raw`Case\\s*(?:No\\.?|Number|Reference|#)?\\s*[:\\-]?\\s*[A-Z0-9][A-Z0-9\\-\\/]{2,30}`,
  String.raw`Residence\\s+Permit\\s*(?:No\\.?|Number|#)?\\s*[:\\-]?\\s*[A-Z0-9][A-Z0-9\\-\\/]{3,30}`,
  String.raw`(?:Date\\s+of\\s+Birth|D\\.?\\s*O\\.?\\s*B\\.?)\\s*[:\\-]?\\s*(?:0?[1-9]|[12]\\d|3[01])[\\/\\-.](?:0?[1-9]|1[0-2])[\\/\\-.](?:19|20)\\d{2}`,
  String.raw`Address\\s*[:\\-]?\\s*[^\\n\\r]{4,100}`,
  String.raw`Mobile\\s*(?:No\\.?|Number)?\\s*[:\\-]?\\s*\\+?[0-9][0-9 ()\\-]{6,20}`,
  String.raw`Telephone\\s*(?:No\\.?|Number)?\\s*[:\\-]?\\s*\\+?[0-9][0-9 ()\\-]{6,20}`,
  String.raw`Email\\s*[:\\-]?\\s*[A-Z0-9._%+\\-]+@[A-Z0-9.\\-]+\\.[A-Z]{2,}`,
  String.raw`Fingerprint\\s*(?:No\\.?|Number|Reference|ID)?\\s*[:\\-]?\\s*[A-Z0-9][A-Z0-9\\-\\/]{2,30}`,
  String.raw`Photo\\s*(?:No\\.?|Number|Reference|ID)?\\s*[:\\-]?\\s*[A-Z0-9][A-Z0-9\\-\\/]{2,30}`,
  String.raw`Guardian\\s*[:\\-]?\\s*[A-ZÀ-ÖØ-öø-ÿ'’\\-]+(?:\\s+[A-ZÀ-ÖØ-öø-ÿ'’\\-]+){1,5}`,
  String.raw`Lawyer\\s*[:\\-]?\\s*[A-ZÀ-ÖØ-öø-ÿ'’\\-]+(?:\\s+[A-ZÀ-ÖØ-öø-ÿ'’\\-]+){1,5}`
];
export const patternText = () => ANONYMISATION_PATTERNS.join("\\n");
