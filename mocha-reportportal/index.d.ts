declare module 'reportportal-client' {
    interface RPConfig {
        token: string;
        endpoint: string;
        launch: string;
        project: string;
    }
    interface RPLaunchInfo {
        name?: string;
        start_time?: number;
        description?: string;
        tags?: string[];
        mode?: 'DEFAULT' | 'DEBUG';
        id: string;
    }
    type RPTestItemTypes = 'SUITE' | 'STORY' | 'TEST' | 'SCENARIO' | 'STEP' | 'BEFORE_CLASS' | 'BEFORE_GROUPS' | 'BEFORE_METHOD' | 'BEFORE_SUITE' | 'BEFORE_TEST' | 'AFTER_CLASS' | 'AFTER_GROUPS' | 'AFTER_METHOD' | 'AFTER_SUITE' | 'AFTER_TEST';
    interface RPTestItem {
        name: string;
        type: RPTestItemTypes;
        description?: string;
        start_time?: number;
        tags: string[];
    }
    interface RPLogInfo {
        level?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | '';
        message?: string;
        time?: number;
    }
    type RPFileTypes = 'image/*' | 'application/xml' | 'application/javascript' | 'application/json' | 'application/css' | 'application/php'
    interface RPFileInfo {
        name: string;
        type: RPFileTypes;
        content: File;
    }
    type RPStatuses = 'PASSED' | 'FAILED' | 'STOPPED' | 'SKIPPED' | 'RESTED' | 'CANCELLED' | '';

    interface RequestReturn {
        tempId: string;
        promise: Promise<any>
    }
    export default class RPClient {
        constructor(config: RPConfig);

        checkConnect(): Promise<{ full_name: string }>
        startLaunch(config?: RPLaunchInfo): Promise<RequestReturn>;
        finishLaunch(id: string, end_time?: number, status?: RPStatuses): Promise<RequestReturn>;
        getPromiseFinishAllItems(id: string): Promise<void>;
        updateLaunch(id: string, info: RPLaunchInfo): Promise<void>;
        startTestItem(testItem: RPTestItem, launchId: string, suiteId?: string): Promise<RequestReturn>;
        finishTestItem(id: string, testItemInfo: { end_time: number, status: RPStatuses, issue: object }): Promise<RequestReturn>;
        sendLog(id: string, logInfo: RPLogInfo, fileObject: RPFileInfo): Promise<RequestReturn>;
        promise: Promise<any>;
    }
}