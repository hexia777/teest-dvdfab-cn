module.exports = {
  printWidth: 110, // 超过110个字符的行将被分割成多行
  semi: false, // 不在语句末尾添加分号
  singleQuote: true, // 使用单引号而不是双引号
  trailingComma: 'all', // 在多行的对象或数组声明中，最后一项后面也添加逗号
  jsxBracketSameLine: true, // 在JSX中，将>放在最后一行的末尾，而不是新的一行的开始
  arrowParens: 'always', // 在单独的箭头函数参数周围包括括号
  insertPragma: false, // 不在文件顶部插入一个特殊的注释，用来指示该文件已经被Prettier格式化
  tabWidth: 2, // 指定每个缩进级别的空格数
  useTabs: false, // 使用制表符（tab）缩进行而不是空格（space）
  bracketSpacing: true, // 在对象字面量声明所使用的的花括号后（{）和前（}）输出空格
  stylelintIntegration: true, // 整合 stylelint，让其可以校验CSS代码
  cssEnable: ['css', 'less', 'sass'], // 启用对CSS，Less和Sass代码的格式化
  endOfLine: 'auto', // 换行符使用auto,
}
