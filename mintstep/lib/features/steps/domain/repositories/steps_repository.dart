import 'package:dartz/dartz.dart';
import 'package:mintstep/core/error/failures.dart';
import 'package:mintstep/features/steps/domain/entities/step_count.dart';

abstract class StepsRepository {
  Future<Either<Failure, StepCount>> getDailySteps(DateTime date);
  Future<Either<Failure, void>> saveSteps(StepCount steps);
  Future<Either<Failure, List<StepCount>>> getPendingSyncSteps();
  Future<Either<Failure, void>> syncStepsWithCloud(List<StepCount> steps);
}
