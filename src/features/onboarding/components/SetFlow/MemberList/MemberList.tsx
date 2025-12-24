import styles from './MemberList.module.scss';

export interface Member {
  id: number;
  name: string;
  position: string;
  avatar?: string;
  initial?: string;
  color?: string;
  percentage?: number;
  rank?: number;
}

interface MembersListProps {
  members?: Member[];
  showPercentage?: boolean;
}

export const MembersList = ({ members, showPercentage = false }: MembersListProps) => {
  const defaultMembers: Member[] = [
    {
      id: 1,
      name: 'Kaylynn Gouse',
      position: 'Product designer',
      avatar: '/avatar1.jpg',
      percentage: 97.25,
      rank: 1,
    },
    {
      id: 2,
      name: 'Lindsey Carder',
      position: 'Front-end developer',
      avatar: '/avatar2.jpg',
      percentage: 96.96,
      rank: 1,
    },
    {
      id: 3,
      name: 'Nolan Siphron',
      position: 'Human resources',
      avatar: '/avatar3.jpg',
      percentage: 96.23,
      rank: 1,
    },
    {
      id: 4,
      name: 'Jasper Lane',
      position: 'UX researcher',
      avatar: '/avatar4.jpg',
      percentage: 95.8,
      rank: 1,
    },
    {
      id: 5,
      name: 'Alyssa Voss',
      position: 'Data analyst',
      avatar: '/avatar5.jpg',
      percentage: 94.75,
      rank: 1,
    },
  ];

  const membersList = members || defaultMembers;

  return (
    <div className={styles.list}>
      {membersList.map((member) => (
        <div key={member.id} className={styles.list__item}>
          {member.rank && (
            <span className={styles.list__rank}>{member.rank}</span>
          )}

          <div className={styles.list__profile}>
            <div 
              className={styles.list__avatar}
              style={!member.avatar && member.color ? { backgroundColor: member.color } : undefined}
            >
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} />
              ) : (
                <span>{member.initial}</span>
              )}
            </div>

            <div className={styles.list__info}>
              <span className={styles.list__name}>{member.name}</span>
              <span className={styles.list__position}>{member.position}</span>
            </div>
          </div>

          {showPercentage && member.percentage && (
            <span className={styles.list__percentage}>
              {member.percentage}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default MembersList;