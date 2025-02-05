export interface ChangelogParams {
  v: string
}

export interface ChangelogResultModel {
  version: string
  list: { [k: number]: string }
  content: string
}
