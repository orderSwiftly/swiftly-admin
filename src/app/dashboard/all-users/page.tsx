import GetUsers from "./get-users";

export default function AllUsersPage() {
    return (
        <main className="min-h-screen bg-[var(--light-bg)] pt-4 md:pt-6 md:pl-72 lg:pl-20 xl:pl-72 px-4 md:px-6 pb-20 md:pb-6 overflow-x-hidden">
            <GetUsers />
        </main>
    );
}