import { languageCode } from "@/utils/i18n";

export default interface GuildSettings {
    requiredMusicSkipVote?: boolean;
    language?: languageCode;
}