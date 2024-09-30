import { redirect } from "next/navigation";

export default () => {
  // just always redirect to the player for now.
  redirect("/player");
};
