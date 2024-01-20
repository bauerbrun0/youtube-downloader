function QualityToggle() {
	return (
		<div class="my-2 h-[30px] w-[220px] rounded-lg bg-accent dark:bg-accent-dark animate-pulse" />
	);
}

function QuickDownload() {
	return (
		<div class="flex flex-col p-3" >
			<div class="flex items-center place-content-between" >
				<div class="h-7 w-60 max-w-full bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
				<div class="h-7 w-7 max-w-full bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
			</div>
			<div class="flex flex-col md:flex-row md:space-x-3 my-3">
				<QualityToggle/>
				<QualityToggle/>
			</div>
			<div class="mt-auto h-[40px] w-full rounded-xl bg-accent dark:bg-accent-dark animate-pulse"/>
		</div>
	);
}


function TableHeaderRow() {
	return (
		<div class="
			grid grid-flow-col grid-cols-[repeat(6,_minmax(0,_1fr))] p-3 md:p-4 gap-1
			
		">
			<div class="h-6 w-[100px] bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
			<div class="h-6 w-[90px] bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
			<div class="h-6 w-[70px] bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
			<div class="h-6 w-[90px] bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
			<div class="h-6 w-[100px] bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
			<div class="h-6 w-[100px] bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
		</div>
	);
}

function TableRow() {
	return (
		<div class="
			grid grid-flow-col grid-cols-[repeat(6,_minmax(0,_1fr))] p-3 md:p-4 gap-1
		">
			<div class="h-6 w-[120px] bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
			<div class="h-6 w-[100px] bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
			<div class="h-6 w-[80px] bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
			<div class="h-6 w-[100px] bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
			<div class="h-6 w-[120px] bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
			<div class="h-6 w-[110px] bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
		</div>
	);
}

function Table() {
	return (
		<div>
			<div class="overflow-x-hidden overscroll-x-none sticky top-[54px] sm:top-[64px] xl:top-[69px] z-20">
				<div class="w-[1520px]">
					<div class="
							bg-white dark:bg-background-dark 
							w-full
					">
						<TableHeaderRow/>
					</div>
				</div>
			</div>
			<div class="overflow-x-hidden overscroll-x-none">
				<div class="w-[1520px]">
					<TableRow/>
					<TableRow/>
					<TableRow/>
					<TableRow/>
					<TableRow/>
					<TableRow/>
					<TableRow/>
					<TableRow/>
					<TableRow/>
					<TableRow/>
					<TableRow/>
					<TableRow/>
					<TableRow/>
					<TableRow/>
					<TableRow/>
					<TableRow/>
				</div>
			</div>
		</div>
	);
}

export default function Loading() {
	return (
		<div class="w-full">
			<div class="relative w-full">
				<div class="hidden w-full h-96 md:block bg-accent dark:bg-accent-dark animate-pulse" />
				<div class="block md:absolute md:bottom-0 md:left-0 md:right-0 mx-auto 2xl:max-w-screen-2xl 2xl:min-w-screen-2xl px-2">
					<div class="w-full flex flex-col md:flex-row md:items-end md:space-x-3 md:mb-3" >
						<div
							class="
								aspect-video rounded-xl w-full md:w-[450px] mt-2 md:mt-0
								bg-accent dark:bg-accent-dark animate-pulse
							"
						/>
						<div class="mt-2" >
							<div class="h-7 xl:h-8 w-60 max-w-full bg-accent dark:bg-accent-dark rounded-md animate-pulse" />
							<div class="h-5 xl:h-6 w-80 max-w-full bg-accent dark:bg-accent-dark rounded-md animate-pulse mt-1" />
						</div>
					</div>
				</div>
			</div>
			<div class="mx-auto 2xl:max-w-screen-2xl px-2 mb-6" >
				<div class="h-px md:hidden mt-3 mb-6" />
				<div class="h-9 md:h-8 w-80 max-w-full bg-accent dark:bg-accent-dark rounded-md animate-pulse my-4" />
				<div class="grid grid-flow-row grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
					<QuickDownload/>
					<QuickDownload/>
					<QuickDownload/>
					<QuickDownload/>
				</div>
				<div class="h-9 md:h-8 w-60 max-w-full bg-accent dark:bg-accent-dark rounded-md animate-pulse my-4" />
				<Table/>
			</div>
		</div>
	);
}