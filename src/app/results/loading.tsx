import React from 'react';
import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.fullScreenLoader} data-testid="fullScreenLoader">
            <div className={styles.loadingBar} data-testid="loadingBar"></div>
            <div className={styles.backgroundImages} data-testid="backgroundImages">
                <div className={styles.backgroundImage}></div>
                <div className={styles.backgroundImage}></div>
                <div className={styles.backgroundImage}></div>
            </div>
        </div>
    );
}
