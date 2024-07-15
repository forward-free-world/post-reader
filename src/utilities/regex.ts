export const ImageRegex = new RegExp('\\[\\/\\/\\]:#\\s*\\(Image:\\s*(.+)\\)');
export const LinkRegex = new RegExp('\\[\\/\\/\\]:#\\s*\\(Link:\\s*(.+)\\)');
export const MetaDataRegex = new RegExp(/^---\n\[\/\/\]:#[\s\S]+---/);
export const TagsRegex = new RegExp('\\[\\/\\/\\]:#\\s*\\(Tags:\\s*(.+)\\)');
export const TitleRegex = new RegExp('\\[\\/\\/\\]:#\\s*\\(Title:\\s*(.+)\\)');
