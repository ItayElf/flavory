import { Header } from "../components/header";
import useCurrentUser from "../hooks/useCurrentUser";

export function Feed() {
  const user = useCurrentUser();
  console.log(user);
  if (!user) {
    return <></>;
  }
  return (
    <div className="h-full">
      <Header user={user} contentStyle="lg:w-[998px] sm:w-[640px] w-full" />
    </div>
  );
}
