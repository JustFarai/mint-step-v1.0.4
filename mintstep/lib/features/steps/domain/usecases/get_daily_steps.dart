import 'package:dartz/dartz.dart';
import 'package:mintstep/core/error/failures.dart';
import 'package:mintstep/core/usecases/usecase.dart';
import 'package:mintstep/features/steps/domain/entities/step_count.dart';
import 'package:mintstep/features/steps/domain/repositories/steps_repository.dart';

class GetDailySteps implements UseCase<StepCount, DateTime> {
  final StepsRepository repository;

  GetDailySteps(this.repository);

  @override
  Future<Either<Failure, StepCount>> call(DateTime params) async {
    return await repository.getDailySteps(params);
  }
}
