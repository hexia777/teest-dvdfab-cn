export interface SentryConfig {
    org: string         // 组织名称，不变，公司所有项目名称是 goland
    project?: string    // 项目名称，不同项目不一样
    dsn?: string        // 不同的dsn值，不同组域名需要替换为不一样，默认的都发到测试分支
    authToken?: string
    url?: string        // 编译上传source map时用到，不同组要用不同的域名替换
    version?: string    // 版本号，不同组自己定义版本号，最好是 project@x.x.x，如 dvdfab_new_online@1.0.0
    sourceMap: boolean  // 是否编译源码，上传到 sentry
    dsnMap: Record<string, string>
}