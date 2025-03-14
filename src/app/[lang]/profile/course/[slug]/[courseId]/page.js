import { myLearningPlay } from "@/actions/myLearnings";
import Sidebar from "../../Sidebar";
import Player from "@/components/Learning/Player";
import Content from "../../Content";

const page = async ({ params }) => {
	const { course } = await myLearningPlay(params);

	return (
		<div className="bg-black py-[50px]">
			<div className="container mx-auto">
				<div className="grid gap-[30px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
					<div className="lg:col-span-2 space-y-[30px]">
						<Player {...course} />
						<Content {...course} />
					</div>
					<Sidebar {...course} />
				</div>
			</div>
		</div>
	);
};

export default page;
