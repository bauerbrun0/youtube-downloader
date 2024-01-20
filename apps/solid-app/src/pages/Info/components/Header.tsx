export default function Header(props: {
	title: string,
	details: string,
	thumbnailSrc: string
}) {
	return (
		<div class="relative w-full">
			<img
				class="hidden w-full h-96 object-cover md:block"
				src={props.thumbnailSrc}
			/>
			<div class="absolute top-0 left-0 right-0 hidden md:block w-full h-96 bg-gradient-to-t from-black to-transparent to-95%"/>
			<div class="block md:absolute md:bottom-0 md:left-0 md:right-0 mx-auto 2xl:max-w-screen-2xl 2xl:min-w-screen-2xl px-2">
				<div class="w-full md:w-fit flex flex-col md:flex-row md:items-end md:space-x-3 md:mb-3">
					<img
						class="aspect-video rounded-xl w-full object-cover md:w-[450px] mt-2 md:mt-0"
						src={props.thumbnailSrc}
					/>
					<div
						class="mt-2 md:text-white"
					>
						<h2 class="text-lg font-bold md:text-xl xl:text-2xl">{props.title}</h2>
						<p class="text-sm mt-1 font-light xl:text-base">
							{props.details}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}