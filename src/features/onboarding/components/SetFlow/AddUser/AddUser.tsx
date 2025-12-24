import { useState } from 'react';
import Plus from '@/assets/icons/Plus';
import styles from './AddUser.module.scss';
import Close from '@/assets/icons/Close';
import ChevronDown from '@/assets/icons/ChevronDown';

interface AddedMember {
  id: number;
  name: string;
  avatar: string | null;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  accessLevel: string;
}

interface AddUserProps {
  onClose?: () => void;
}

export const AddUser = ({ onClose }: AddUserProps) => {
  const [activeTab, setActiveTab] = useState<'user' | 'email'>('user');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    accessLevel: '',
  });

  const [addedMembers] = useState<AddedMember[]>([
    { id: 1, name: 'John Doe', avatar: '/avatar1.jpg' },
    { id: 2, name: 'Jane Smith', avatar: '/avatar2.jpg' },
    { id: 3, name: 'Mike Johnson', avatar: '/avatar3.jpg' },
    { id: 4, name: 'Sarah Williams', avatar: '/avatar4.jpg' },
    { id: 5, name: 'Tom Brown', avatar: '/avatar5.jpg' },
    { id: 6, name: 'Emily Davis', avatar: null },
    { id: 7, name: 'David Wilson', avatar: null },
  ]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add user:', formData);
  };

  return (
    <div className={styles.user}>
      <div className={styles.user__overlay} onClick={onClose} />
      
      <div className={styles.user__modal}>
        <button className={styles.user__close} onClick={onClose}>
          <Close />
        </button>

        <div className={styles.user__header}>
          <h2 className={styles.user__title}>How many people are on your team</h2>
          <p className={styles.user__description}>
            How many members are currently part of your company or department?
          </p>
        </div>

        <div className={styles.user__tabs}>
          <button
            className={`${styles.user__tabs__item} ${
              activeTab === 'email' ? styles.user__tabs__item__active : ''
            }`}
            onClick={() => setActiveTab('email')}
          >
            Invite via Email
          </button>
          <button
            className={`${styles.user__tabs__item} ${
              activeTab === 'user' ? styles.user__tabs__item__active : ''
            }`}
            onClick={() => setActiveTab('user')}
          >
            Add new user
          </button>
        </div>

        <form className={styles.user__form} onSubmit={handleSubmit}>
          <div className={styles.user__row}>
            <div className={styles.user__field}>
              <label className={styles.user__label}>Email</label>
              <input
                type="email"
                className={styles.user__input}
                placeholder="Enter email"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </div>

            <div className={styles.user__field}>
              <label className={styles.user__label}>Email</label>
              <input
                type="email"
                className={styles.user__input}
                placeholder="Enter email"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.user__field}>
            <label className={styles.user__label}>Email</label>
            <input
              type="email"
              className={styles.user__input}
              placeholder="Example"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          <div className={styles.user__field}>
            <label className={styles.user__label}>Position</label>
            <div className={styles.user__select}>
              <select
                className={styles.user__select__input}
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
              >
                <option value="">Product Designer</option>
                <option value="developer">Software Developer</option>
                <option value="manager">Product Manager</option>
                <option value="analyst">Data Analyst</option>
              </select>
              <ChevronDown className={styles.user__select__icon} />
            </div>
          </div>

          <div className={styles.user__field}>
            <label className={styles.user__label}>Department</label>
            <div className={styles.user__select}>
              <select
                className={styles.user__select__input}
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
              >
                <option value="">Choose department</option>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
              </select>
              <ChevronDown className={styles.user__select__icon} />
            </div>
          </div>

          <div className={styles.user__field}>
            <label className={styles.user__label}>Access Level</label>
            <div className={styles.user__select}>
              <select
                className={styles.user__select__input}
                value={formData.accessLevel}
                onChange={(e) => handleInputChange('accessLevel', e.target.value)}
              >
                <option value="">Choose acccess level</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
              <ChevronDown className={styles.user__select__icon} />
            </div>
          </div>

          <button type="submit" className={styles.user__submit}>
            Add User
          </button>
        </form>

        <div className={styles.user__divider} />

        <div className={styles.user__members}>
          <h3 className={styles.user__members__title}>
            Added Members ({addedMembers.length})
          </h3>

          <div className={styles.user__avatars}>
            {addedMembers.slice(0, 5).map((member) => (
              <div key={member.id} className={styles.user__avatars__item}>
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} />
                ) : (
                  <div className={styles.user__avatars__placeholder}>
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
            ))}
            {addedMembers.length > 5 && (
              <div className={styles.user__avatars__more}>
                <Plus />
                <span>{addedMembers.length - 5}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.user__footer}>
          <button className={styles.user__footer__skip} onClick={onClose}>
            Skip
          </button>
          <button className={styles.user__footer__continue}>
            Continue ({addedMembers.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;