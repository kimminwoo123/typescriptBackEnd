export class LectureRequest {
    constructor(
        private category: Category,
        private searchWord: string,
        private sortCondition: SortCondition,
        private page: number | 1,
        private pageSize: number | 10
    ) { }

    getOffset(): number {
        return (this.page - 1) * this.pageSize
    }

    getLimit(): number {
        return this.pageSize
    }

    getCategory(): LectureRequest['category'] {
        return this.category
    }

    getSearchWord(): LectureRequest['searchWord'] {
        return this.searchWord
    }

    getSortCondition(): LectureRequest['sortCondition'] {
        return this.sortCondition
    }
}