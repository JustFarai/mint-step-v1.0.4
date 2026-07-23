import 'package:dartz/dartz.dart';
import 'package:mintstep/core/error/failures.dart';
import 'package:mintstep/features/steps/data/datasources/steps_local_datasource.dart';
import 'package:mintstep/features/steps/data/datasources/steps_remote_datasource.dart';
import 'package:mintstep/features/steps/data/models/step_count_model.dart';
import 'package:mintstep/features/steps/domain/entities/step_count.dart';
import 'package:mintstep/features/steps/domain/repositories/steps_repository.dart';

class StepsRepositoryImpl implements StepsRepository {
  final StepsLocalDataSource localDataSource;
  final StepsRemoteDataSource remoteDataSource;

  StepsRepositoryImpl({
    required this.localDataSource,
    required this.remoteDataSource,
  });

  @override
  Future<Either<Failure, StepCount>> getDailySteps(DateTime date) async {
    try {
      // 1. Check local cache first (Offline-First!)
      final localSteps = await localDataSource.getLastStepCount(date);
      if (localSteps != null) {
        return Right(localSteps);
      }

      // 2. Fetch from cloud if not cached
      try {
        final remoteSteps = await remoteDataSource.fetchRemoteSteps(date);
        if (remoteSteps != null) {
          await localDataSource.cacheStepCount(remoteSteps);
          return Right(remoteSteps);
        }
      } catch (_) {
        // Fallback to default empty steps if cloud fetch fails due to network
      }

      // 3. Return a baseline default if no records exist anywhere
      final defaultSteps = StepCountModel(
        id: date.millisecondsSinceEpoch.toString(),
        count: 0,
        date: date,
        caloriesBurned: 0.0,
        distanceKm: 0.0,
        isSynced: false,
      );
      await localDataSource.cacheStepCount(defaultSteps);
      return Right(defaultSteps);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> saveSteps(StepCount steps) async {
    try {
      final model = StepCountModel.fromEntity(steps);
      
      // Save locally first for instant UI response and offline support
      await localDataSource.cacheStepCount(model.copyWith(isSynced: false));

      // Attempt background cloud sync immediately (don't block user if offline)
      _syncImmediately(model);

      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<StepCount>>> getPendingSyncSteps() async {
    try {
      final list = await localDataSource.getPendingSync();
      return Right(list);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> syncStepsWithCloud(List<StepCount> steps) async {
    try {
      for (var step in steps) {
        final model = StepCountModel.fromEntity(step);
        await remoteDataSource.uploadSteps(model);
        await localDataSource.cacheStepCount(model.copyWith(isSynced: true));
      }
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  void _syncImmediately(StepCountModel model) async {
    try {
      await remoteDataSource.uploadSteps(model);
      await localDataSource.cacheStepCount(model.copyWith(isSynced: true));
    } catch (_) {
      // Fail silently, it will sync during the next cron or automatic sync cycle!
    }
  }
}
