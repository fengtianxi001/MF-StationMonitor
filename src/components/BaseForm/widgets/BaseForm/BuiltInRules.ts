const RegExpList = {
  // 电话号码(包含座机和手机)
  phone:
    /^(0\d{2,3}-)?([2-9]\d{6,7})+(-\d{1,6})?$|^((\+86|\+86-)|(86|86-)|(0086|0086-))?1[3|5|7|8]\d{9}$/,
  // 手机号码
  mobile: /^1[3|4|5|6|7|8|9][0-9]{9}$/,
  // 座机号码
  landline: /^(0\d{2,3}-)?([2-9]\d{6,7})+(-\d{1,6})?$/,
  // 邮箱
  email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/,
  // 域名
  domain: /^([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/,
  // 链接
  link: /[a-zA-z]+:\/\/[^\s]/,
  // IP地址
  ip: /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[1-9])\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[1-9])$/,
  // 端口号
  port: /^([1-9]|[1-9]\d{1,3}|[1-6][0-5][0-5][0-3][0-5])$/,
  // 身份证号
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  // 邮政编码
  postalCode: /^[1-9][0-9]{5}$/,
  // 中文
  chinese: /^[\u4e00-\u9fa5]+$/,
  // 英文
  english: /^[a-zA-Z]+$/,
}

/** @description: 电话号码验证规则  */
export const phoneRule = {
  match: RegExpList.phone,
  message: '请输入正确的电话号码',
}

/** @description: 座机号码验证规则  */
export const landlineRule = {
  match: RegExpList.landline,
  message: '请输入正确的座机号码',
}

/** @description: 手机号码验证规则  */
export const mobileRule = {
  match: RegExpList.mobile,
  message: '请输入正确的手机号码',
}

/** @description: 邮箱验证规则  */
export const emailRule = {
  match: RegExpList.email,
  message: '请输入正确的邮箱地址',
}

/** @description: 域名验证规则  */
export const domainRule = {
  match: RegExpList.domain,
  message: '请输入正确的域名',
}

/** @description: 链接的验证规则  */
export const linkRule = {
  match: RegExpList.link,
  message: '请输入正确的链接地址',
}

/** @description: IP地址的验证规则  */
export const ipRule = {
  match: RegExpList.ip,
  message: '请输入正确的IP地址',
}

/** @description: 端口号的验证规则  */
export const portRule = {
  match: RegExpList.port,
  message: '请输入正确的端口号',
}

/** @description: 身份证号的验证规则  */
export const idCardRule = {
  match: RegExpList.idCard,
  message: '请输入正确的身份证号',
}

/** @description: 邮政编码的验证规则  */
export const postalCodeRule = {
  match: RegExpList.postalCode,
  message: '请输入正确的邮政编码',
}

/** @description: 中文的验证规则  */
export const chineseRule = {
  match: RegExpList.chinese,
  message: '请输入中文',
}

/** @description: 英文的验证规则  */
export const englishRule = {
  match: RegExpList.english,
  message: '请输入英文',
}

export const builtInRules = {
  phoneRule,
  mobileRule,
  emailRule,
  domainRule,
  linkRule,
  ipRule,
  portRule,
  idCardRule,
  postalCodeRule,
  chineseRule,
  englishRule,
} as any

export type BuiltInRulesType = keyof typeof builtInRules
