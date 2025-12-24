import { useState } from 'react';
import Plus from '@/assets/icons/Plus';
import styles from './TeamInvite.module.scss';
import Close from '@/assets/icons/Close';
import ChevronDown from '@/assets/icons/ChevronDown';

interface AddedMember {
  id: number;
  name: string;
  avatar: string | null;
}

interface TeamInviteProps {
  onClose?: () => void;
}

export const TeamInvite = ({ onClose }: TeamInviteProps) => {
  const [activeTab, setActiveTab] = useState<'email' | 'user'>('email');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [addedMembers] = useState<AddedMember[]>([
    { id: 1, name: 'John Doe', avatar: '/avatar1.jpg' },
    { id: 2, name: 'Jane Smith', avatar: '/avatar2.jpg' },
    { id: 3, name: 'Mike Johnson', avatar: '/avatar3.jpg' },
    { id: 4, name: 'Sarah Williams', avatar: '/avatar4.jpg' },
    { id: 5, name: 'Tom Brown', avatar: '/avatar5.jpg' },
    { id: 6, name: 'Emily Davis', avatar: null },
    { id: 7, name: 'David Wilson', avatar: null },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Send invitation:', { email, department });
  };

  return (
    <div className={styles.invite}>
      <div className={styles.invite__overlay} onClick={onClose} />
      
      <div className={styles.invite__modal}>
        <button className={styles.invite__close} onClick={onClose}>
          <Close />
        </button>

        <div className={styles.invite__header}>
          <h2 className={styles.invite__title}>How many people are on your team</h2>
          <p className={styles.invite__description}>
            How many members are currently part of your company or department?
          </p>
        </div>

        <div className={styles.invite__tabs}>
          <button
            className={`${styles.invite__tabs__item} ${
              activeTab === 'email' ? styles.invite__tabs__item__active : ''
            }`}
            onClick={() => setActiveTab('email')}
          >
            Invite via Email
          </button>
          <button
            className={`${styles.invite__tabs__item} ${
              activeTab === 'user' ? styles.invite__tabs__item__active : ''
            }`}
            onClick={() => setActiveTab('user')}
          >
            Add new user
          </button>
        </div>

        <form className={styles.invite__form} onSubmit={handleSubmit}>
          <div className={styles.invite__field}>
            <label className={styles.invite__label}>Email</label>
            <input
              type="email"
              className={styles.invite__input}
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.invite__field}>
            <label className={styles.invite__label}>Select Departament</label>
            <div className={styles.invite__select}>
              <select
                className={styles.invite__select__input}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Choose department</option>
                <option value="engineering">Engineering</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="hr">Human Resources</option>
              </select>
              <ChevronDown className={styles.invite__select__icon} />
            </div>
          </div>

          <button type="submit" className={styles.invite__submit}>
            Send Invitation
          </button>
        </form>

        <div className={styles.invite__divider} />

        <div className={styles.invite__members}>
          <h3 className={styles.invite__members__title}>
            Added Members ({addedMembers.length})
          </h3>

          <div className={styles.invite__avatars}>
            {addedMembers.slice(0, 5).map((member) => (
              <div key={member.id} className={styles.invite__avatars__item}>
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} />
                ) : (
                  <div className={styles.invite__avatars__placeholder}>
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
            ))}
            {addedMembers.length > 5 && (
              <div className={styles.invite__avatars__more}>
                <Plus />
                <span>{addedMembers.length - 5}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.invite__footer}>
          <button className={styles.invite__footer__skip} onClick={onClose}>
            Skip
          </button>
          <button className={styles.invite__footer__continue}>
            Continue ({addedMembers.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamInvite;