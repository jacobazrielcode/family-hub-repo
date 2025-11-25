import { AuthService } from '../services/AuthService';

export interface FamilyMember {
  id: string;
  name: string;
  colorId: string;
  hexCode: string;
}

const DEFAULT_MAPPING: FamilyMember[] = [
  { id: '1', name: 'Family', colorId: '1', hexCode: '#7986cb' },
  { id: '2', name: 'Mom', colorId: '2', hexCode: '#33b679' },
  { id: '3', name: 'Dad', colorId: '3', hexCode: '#8e24aa' },
];

export class FamilyIdentity {
  static async getFamilyMapping(): Promise<FamilyMember[]> {
    return DEFAULT_MAPPING; // Simplified for MVP
  }

  static assignMemberToEvent(event: any, members: FamilyMember[]) {
    const member = members.find(m => m.colorId === event.colorId);
    return {
      ...event,
      familyMember: member ? member.name : 'General',
      displayColor: member ? member.hexCode : '#999999'
    };
  }
}