import axios from "axios";
import { User } from "discord.js";

export async function FetchUserByOAuth(type: 'barear' | string, key: string): Promise<User | false> {
  // Implement OAuth fetch user logic here
  try {
    const user = await axios.get('https://discord.com/api/v10/users/@me', {
        headers: {
            Authorization: `${type} ${key}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            "User-Agent": "Pona! Application (OpenPonlponl123.com/v1)"
        }
    })
    if ( user.status === 200 ) return user.data;
} catch (err) {
  console.error("Error fetching user from Discord API :", err);
  return false;
}
  return false;
}