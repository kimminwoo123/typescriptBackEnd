export class LectureRequest {
    category: Category
    searchWord: string
    sortCondition: SortCondition
    page: number | 1
    pageSize: number | 10

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

    static create(
        category: LectureRequest['category'],
        searchWord: LectureRequest['searchWord'],
        sortCondition: LectureRequest['sortCondition'],
        page: LectureRequest['page'],
        pageSize: LectureRequest['pageSize']
    ) {
        const request = new LectureRequest()
        request.category = category
        request.searchWord = searchWord
        request.sortCondition = sortCondition
        request.page = page
        request.pageSize = pageSize
        return request
    }
}