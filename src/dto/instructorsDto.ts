import dayjs from 'dayjs'

class InstructorsDto {
    private instrudctorId: string
    private instrudctorName: string
    private registDate: string

    getInstructors() {
        return {
            instrudctorId: this.instrudctorId,
            instrudctorName: this.instrudctorName,
            registDate: this.registDate,
        }
    }

    setInstructors(instrudctorId: string, instrudctorName: string, registDate: string) {
        this.instrudctorId = instrudctorId
        this.instrudctorName = instrudctorName
        this.registDate = registDate
    }
}

const inst = new InstructorsDto()

console.log(inst.getInstructors())

inst.setInstructors('qwer', '하루키', '20220224')

console.log(inst.getInstructors())

