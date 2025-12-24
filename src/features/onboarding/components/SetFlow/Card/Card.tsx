import { useState, useRef, useEffect } from 'react';
import More from '@/assets/icons/More';
import Company from '@/assets/icons/Company';
import Plus from '@/assets/icons/Plus';
import { SafeImage } from '@/components/ui/SafeImage';
import { MembersList } from '../MemberList/MemberList';
import styles from './Card.module.scss';

export interface TeamMember {
    color: string;
    image?: string | null;
    initial: string;
    name: string;
    position: string;
}

export interface EmployeeData {
    id: string;
    title: string;
    name: string;
    position: string;
    initial: string;
    isCompany?: boolean;
    team?: TeamMember[];
    onAddSubdepartment?: (id: string) => void;
}

interface CardProps {
    data: EmployeeData;
}

export const Card = ({ data }: CardProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [memberListOpen, setMemberListOpen] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const memberListRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Elevate card z-index when popup is open
    useEffect(() => {
        const card = cardRef.current?.parentElement;
        if (card) {
            if (memberListOpen || menuOpen) {
                card.style.zIndex = '9999';
            } else {
                card.style.zIndex = '';
            }
        }
    }, [memberListOpen, menuOpen]);

    // Close popups when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (memberListRef.current && !memberListRef.current.contains(event.target as Node)) {
                setMemberListOpen(false);
            }
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        if (memberListOpen || menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [memberListOpen, menuOpen]);

    const handleCountClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setMemberListOpen(prev => !prev);
        setMenuOpen(false);
    };

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setMenuOpen(prev => !prev);
        setMemberListOpen(false);
    };

    const handleAddSubdepartment = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        data.onAddSubdepartment?.(data.id);
        setMenuOpen(false);
    };

    return (
        <div ref={cardRef} className={styles.card}>
            <button className={styles.card__menu} onMouseDown={handleMenuClick}>
                <More />
            </button>

            <div className={styles.card__header}>
                {data.isCompany && <Company />}
                <h3 className={styles.card__title}>{data.title}</h3>
            </div>

            <div className={styles.card__info}>
                <div className={styles.card__avatar}>
                    <span className={styles.card__avatar__initial}>{data.initial}</span>
                </div>
                <div className={styles.card__details}>
                    <span className={styles.card__name}>{data.name}</span>
                    <span className={styles.card__position}>{data.position}</span>
                </div>
            </div>

            {data.team && (
                <div className={styles.card__team}>
                    {data.team.slice(0, 6).map((member, index) => (
                        <div key={index} className={styles.card__team__avatar} style={{ background: member.color }}>
                            {member.image ? (
                                <SafeImage src={member.image} alt={member.name || ''} fill />
                            ) : (
                                member.initial && <span>{member.initial}</span>
                            )}
                        </div>
                    ))}
                    {data.team.length > 6 && (
                        <button 
                            className={styles.card__team__count}
                            onMouseDown={handleCountClick}
                        >
                            +{data.team.length - 6}
                        </button>
                    )}
                </div>
            )}

            {memberListOpen && data.team && (
                <div ref={memberListRef} className={styles.card__memberListWrapper}>
                    <MembersList 
                        members={data.team.map((member, index) => ({
                            id: index + 1,
                            name: member.name,
                            position: member.position,
                            avatar: member.image || undefined,
                            initial: member.initial,
                            color: member.color,
                        }))}
                        onClose={() => setMemberListOpen(false)}
                    />
                </div>
            )}

            {menuOpen && (
                <div ref={menuRef} className={styles.menu}>
                    <button className={styles.menu__item} onMouseDown={handleAddSubdepartment}>
                        <div className={styles.menu__icon}>
                            <Plus />
                        </div>
                        <div className={styles.menu__content}>
                            <span className={styles.menu__title}>Add subdepartment or team</span>
                            <span className={styles.menu__description}>
                                New department or team will be made subordinate to this department.
                            </span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Card;