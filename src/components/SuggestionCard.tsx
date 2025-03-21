import { getSuggestionUsers } from "@/actions/user.actions";
import SuggestionCardItem from "./SuggestionCardItem";

const SuggestionCard = async () => {
  const suggestionUsers = await getSuggestionUsers();
  if (!suggestionUsers || suggestionUsers.length === 0) return null;
  console.log(suggestionUsers);
  return (
    <div className="flex flex-col items-center  divide-y">
      {suggestionUsers.map((user) => (
        <SuggestionCardItem key={user.id} user={user} />
      ))}
    </div>
  );
};

export default SuggestionCard;
