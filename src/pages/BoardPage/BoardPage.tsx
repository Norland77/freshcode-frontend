import {useLoaderData} from "react-router-dom";
import {ILists} from "interfaces/Lists.ts";

const BoardPage = () => {
  const lists = useLoaderData() as ILists[];

  console.log(lists)
  return (
    <div>

    </div>
  );
};

export default BoardPage;