import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import CaretDown from '@/assets/icons/CaretDown';
import styles from './SetCompany.module.scss';
import DocumentUpload from '@/assets/icons/DocumentUpload';

interface SetCompanyProps {
    onNext?: () => void;
}

export const SetCompany = ({ onNext }: SetCompanyProps) => {
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        employeesCount: '',
        logo: null as File | null,
    });
    const [error, setError] = useState('');

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('File size exceeds 2MB');
                return;
            }
            if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
                setError('Only PNG or JPG files are allowed');
                return;
            }
            setFormData(prev => ({ ...prev, logo: file }));
            setError('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onNext) onNext();
    };

    return (
        <div className={styles.company}>
            <div className={styles.company__left}>
                <div className={styles.company__left__blur} />
                <div className={styles.company__left__blur2} />

                <div className={styles.company__logo}>
                    <SafeImage src="/Nebula.svg" alt="Nebula" fill />
                </div>

                <form className={styles.company__form} onSubmit={handleSubmit}>
                    <div className={styles.company__form__header}>
                        <h1 className={styles.company__form__title}>Set Company</h1>
                        <p className={styles.company__form__description}>
                            Let your brand take its place. Add your company's name and logo to make every step of this journey uniquely yours.
                        </p>
                    </div>

                    <div className={styles.company__form__fields}>
                        <div className={styles.company__form__field}>
                            <label className={styles.company__form__field__label}>Name</label>
                            <input
                                type="text"
                                placeholder="Company name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={styles.company__form__field__input}
                            />
                        </div>

                        <div className={styles.company__form__field}>
                            <label className={styles.company__form__field__label}>Industry</label>
                            <div className={styles.company__form__field__select}>
                                <select
                                    value={formData.industry}
                                    onChange={(e) => handleInputChange('industry', e.target.value)}
                                    className={styles.company__form__field__select__input}
                                >
                                    <option value="">Select industry</option>
                                    <option value="technology">Technology</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="finance">Finance</option>
                                    <option value="education">Education</option>
                                    <option value="retail">Retail</option>
                                </select>
                                <div className={styles.company__form__field__select__icon}>
                                    <CaretDown />
                                </div>
                            </div>
                        </div>

                        <div className={styles.company__form__field}>
                            <label className={styles.company__form__field__label}>
                                Employees count
                            </label>
                            <div className={styles.company__form__field__select}>
                                <select
                                    value={formData.employeesCount}
                                    onChange={(e) => handleInputChange('employeesCount', e.target.value)}
                                    className={styles.company__form__field__select__input}
                                >
                                    <option value="">Select range</option>
                                    <option value="1-10">1-10</option>
                                    <option value="11-50">11-50</option>
                                    <option value="51-200">51-200</option>
                                    <option value="201-500">201-500</option>
                                    <option value="501+">501+</option>
                                </select>
                                <div className={styles.company__form__field__select__icon}>
                                    <CaretDown />
                                </div>
                            </div>
                        </div>

                        <div className={styles.company__form__upload}>
                            <label className={styles.company__form__upload__label}>Logo</label>
                            <div className={styles.company__form__upload__area}>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={handleLogoUpload}
                                    className={styles.company__form__upload__input}
                                    id="logo-upload"
                                />
                                <label
                                    htmlFor="logo-upload"
                                    className={styles.company__form__upload__content}
                                >
                                    <div className={styles.company__form__upload__button}>
                                        <DocumentUpload />
                                        <span className={styles.company__form__upload__button__text}>
                                            Upload logo
                                        </span>
                                    </div>
                                    <span className={styles.company__form__upload__info}>
                                        Only PNG or JPG file (max. 2MB)
                                    </span>
                                </label>
                            </div>
                            {error && <span className={styles.company__form__upload__error}>{error}</span>}
                        </div>
                    </div>
                </form>

                <button className={styles.company__button} onClick={handleSubmit}>
                    Next
                </button>
            </div>

            <div className={styles.company__right}>
                <div className={styles.company__right__blur} />
                <div className={styles.company__right__blur2} />
                <div className={styles.company__right__image}>
                    <SafeImage
                        src="/onboarding.gif"
                        alt="AI"
                        fill
                    />
                </div>
                <p className={styles.company__right__text}>AI is waiting ...</p>
            </div>
        </div>
    );
};
