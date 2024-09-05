import fsPromises from "fs/promises";

import path from "path";
import {Track} from "../../components/types";
import {NextApiRequest, NextApiResponse} from "next";

const songsPath = path.join("public", "songs");

// type Track = {
// 	uri: string;
// 	imgUri?: string;
// 	name: string;
// 	id: string;
// };

export type TracksResponse = {
	data: Track[];
};

let songs: Track[];

const init = async () => {
	const result = await fsPromises.readdir(songsPath);
	console.log("result is", result);
	songs = result.map((el, index) => {
		const song = {
			uri: `/songs/${encodeURI(el)}`,
			name: el,
			id: `${index}`,
		};
		console.log("song is", song);
		return song;
	});
};

init();

export default async function handler(req: NextApiRequest, res: NextApiResponse<TracksResponse>) {
	console.log(songs);
	res.json({
		data: songs,
	});
}
