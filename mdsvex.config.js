import relativeImages from "mdsvex-relative-images";
import autolinkHeadings from 'rehype-autolink-headings'
import remarkHeadings from '@vcarl/remark-headings'
import slugPlugin from 'rehype-slug'

export default {
	extensions: ['.svx', '.md'],
	remarkPlugins: [relativeImages, headings],
	rehypePlugins: [
		slugPlugin,
		[
			autolinkHeadings,
			{
				behavior: 'wrap'
			}
		]
	]
};


/**
 * Parses headings and includes the result in metadata
 */
function headings() {
	return function transformer(tree, vfile) {
		// run remark-headings plugin
		remarkHeadings()(tree, vfile)

		// include the headings data in mdsvex frontmatter
		vfile.data.fm ??= {}
		vfile.data.fm.headings = vfile.data.headings.map((heading) => ({
			...heading,
			// slugify heading.value
			id: heading.value
				.toLowerCase()
				.replace(/\s/g, '-')
				.replace(/[^a-z0-9-]/g, '')
		}))
	}
}