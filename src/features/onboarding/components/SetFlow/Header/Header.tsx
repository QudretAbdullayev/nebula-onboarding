import Back from '@/assets/icons/Back';
import styles from './Header.module.scss';

interface HeaderProps {
    onBack?: () => void;
}

export const Header = ({ onBack }: HeaderProps) => {
    return (
        <header className={styles.header}>
            <button className={styles.header__back} onClick={onBack}>
                <Back />
                <span>Back</span>
            </button>

            <div className={styles.header__info}>
                <h1 className={styles.header__title}>Company Hierarchy</h1>
                <p className={styles.header__description}>
                    Rate each competency based on your performance this month.
                </p>
            </div>
        </header>
    );
};
