// Rewire Event Registration System - Type Definitions

export type ParticipantStatus =
    | 'PROFILE_ONLY'
    | 'CAPTAIN'
    | 'MEMBER'
    | 'FREE_AGENT'
    | 'CANCELLED';

export type TeamStatus = 'PENDING' | 'CONFIRMED';

export type RoleInTeam = 'CAPTAIN' | 'MEMBER' | '';

export type Source = 'STALL' | 'ONLINE';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Participant {
    timestamp_ist: string;
    participant_id: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    year: string;
    skills: string;
    status: ParticipantStatus;
    team_code: string;
    role_in_team: RoleInTeam;
    consent: 'YES' | 'NO';
    source: Source;
    last_updated_ist: string;
}

export interface Team {
    team_code: string;
    created_at_ist: string;
    captain_participant_id: string;
    captain_email: string;
    members_count: number;
    member_emails: string;
    status: TeamStatus;
    notes: string;
}

export interface JoinRequest {
    created_at_ist: string;
    request_id: string;
    type: 'JOIN_REQUEST';
    team_code: string;
    participant_id: string;
    participant_email: string;
    status: RequestStatus;
    handled_by: string;
    handled_at_ist: string;
}

export interface ProfilePayload {
    name: string;
    email: string;
    phone: string;
    college: string;
    year: string;
    skills: string[];
    consent: boolean;
    source: Source;
}

export interface CreateTeamPayload {
    participant_id: string;
}

export interface JoinTeamPayload {
    participant_id: string;
    team_code: string;
}

export interface FreeAgentPayload {
    participant_id: string;
}

export interface StatusPayload {
    participant_id: string;
}

export interface ApiResponse<T = unknown> {
    ok: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface ProfileResponse {
    participant_id: string;
    status: ParticipantStatus;
    isNew: boolean;
}

export interface CreateTeamResponse {
    team_code: string;
    status: TeamStatus;
}

export interface JoinTeamResponse {
    team_code: string;
    members_count: number;
    status: TeamStatus;
}

export interface StatusResponse {
    participant: Participant | null;
    team: Team | null;
    team_members: Array<{ name: string; email: string }>;
}

// Apps Script action types
export type AppsScriptAction =
    | 'PROFILE'
    | 'CREATE_TEAM'
    | 'JOIN_TEAM'
    | 'FREE_AGENT'
    | 'STATUS'
    | 'ADMIN_STATS'
    | 'SEND_OTP'
    | 'VERIFY_OTP_AND_REGISTER';

export interface AppsScriptRequest {
    action: AppsScriptAction;
    data: Record<string, unknown>;
}

export interface AppsScriptResponse<T = unknown> {
    ok: boolean;
    message: string;
    data?: T;
}

// Admin types
export interface AdminStats {
    totalParticipants: number;
    freeAgents: number;
    pendingTeams: number;
    confirmedTeams: number;
    incompleteTeams: Array<{
        team_code: string;
        members_count: number;
        captain_email: string;
        member_emails: string;
    }>;
    freeAgentList: Array<{
        participant_id: string;
        name: string;
        email: string;
        phone: string;
        skills: string;
    }>;
}
