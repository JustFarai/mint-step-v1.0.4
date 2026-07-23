import 'package:dartz/dartz.dart';
import 'package:mintstep/core/error/failures.dart';
import 'package:mintstep/core/usecases/usecase.dart';
import 'package:mintstep/features/steps/domain/repositories/steps_repository.dart';

class SyncSteps implements UseCase<void, NoParams> {
  final StepsRepository repository;

  SyncSteps(this.repository);

  @override
  Future<Either<Failure, void>> call(NoParams params) async {
    final pendingResult = await repository.getPendingSyncSteps();
    
    return pendingResult.fold(
      (failure) => Left(failure),
      (pendingSteps) async {
        if (pendingSteps.isEmpty) {
          return const Right(null);
        }
        return await repository.syncStepsWithCloud(pendingSteps);
      },
    );
  }
}
