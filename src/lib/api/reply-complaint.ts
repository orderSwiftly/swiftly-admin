export default async function ReplyComplaint(complaintId: string, replyContent: string) {
    try {
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem("token");
        const response = await fetch(`${api_url}/api/v1/complaint/${complaintId}/reply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ message: replyContent }),
        });

        if (!response.ok) {
            throw new Error("Failed to reply to complaint");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error replying to complaint:", error);
        throw error;
    }
}