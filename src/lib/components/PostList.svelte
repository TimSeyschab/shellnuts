<script>
	/**
	 * @type {any}
	 */
	export let posts;
</script>

{#each posts as post}
	<div class="card w-96 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">{post.date}: {post.title}</h2>
			{@html post.preview.html}
			<div class="card-actions justify-end">
				<a class="btn btn-primary" href={`/post/${post.slug}`}>Read now</a>
			</div>
		</div>
	</div>
{/each}
