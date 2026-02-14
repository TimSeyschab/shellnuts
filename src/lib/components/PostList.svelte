<script lang="ts">
	import { resolve } from '$app/paths';

	let { posts } = $props();

	function callLink(event: UIEvent) {
		const isTextSelected = window?.getSelection()?.toString();
		if (!isTextSelected && event.target instanceof HTMLElement) {
			let parent = event.target.closest('.card');
			(parent?.querySelector('.main-link') as HTMLAnchorElement).click();
		}
	}
</script>

{#each posts as post (post.slug)}
	<div
		class="card w-96 bg-secondary-content shadow-xl"
		role="button"
		tabindex="0"
		onclick={(el) => callLink(el)}
		onkeydown={(el) => callLink(el)}
	>
		<div class="card-body">
			<h2 class="card-title">
				<a class="main-link" href={resolve(`/post/${post.slug}`)}>{post.date}: {post.title}</a>
			</h2>
			<p>{post.preview.text}</p>
			<div class="card-actions justify-end"></div>
		</div>
	</div>
{/each}

<style>
	:global(.card-body p a) {
		text-decoration: underline;
	}
</style>
