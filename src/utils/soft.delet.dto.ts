// // SOFT_REMOVE CleanUp function
// import { Cron } from '@nestjs/schedule';

// export class cleanUp {
//   // 소프트리무브 시킨 이력서가 시간이 지나면 자동으로 삭제 하는 로직
//   @Cron('0 0 0 * * *') // ('0 0 0 0 0 0') 왼쪽 0부터 초, 분, 시, 일, 월, 요일
//   async cleanupSoftRemoveResume() {
//     // Date 타입의 데이터를 담고
//     const aFewMomentLater = new Date();
//     // 담은 데이터에서 1일을 뺀 데이터를 세팅한다.
//     aFewMomentLater.setDate(aFewMomentLater.getDate() - 1);
//     // const cleanupTarget = await this.resumeRepository.find({ where: { deletedAt: Not(IsNull()) } });
//     const cleanupTarget = await this.resumeRepository.find({
//       where: { deletedAt: LessThan(aFewMomentLater) },
//     });
//     await this.resumeRepository.delete({
//       where: { deletedAt: LessThan(aFewMomentLater) },
//     });
//   }
// }
