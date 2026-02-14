<script lang="ts">
	import { resolve } from '$app/paths';

	let { posts } = $props();
</script>

{#each posts as post (post.slug)}
	<article
		class="card w-full border border-base-300 bg-base-100 shadow-md transition-all hover:shadow-xl"
	>
		<div class="card-body gap-4 p-6 md:p-8">
			<div class="flex flex-wrap items-center gap-2">
				<span class="badge badge-outline">{post.date}</span>
			</div>
			<h2 class="card-title text-2xl md:text-3xl leading-tight">
				<a class="main-link" href={resolve(`/post/${post.slug}`)}>{post.title}</a>
			</h2>
			<p class="text-base-content/80 text-base md:text-lg">{post.preview.text}</p>
			<div class="card-actions justify-end">
				<a class="btn btn-ghost btn-sm" href={resolve(`/post/${post.slug}`)}>Read article</a>
			</div>
		</div>
	</article>
{/each}
