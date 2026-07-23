import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:mintstep/features/steps/domain/entities/step_count.dart';
import 'package:mintstep/features/steps/domain/repositories/steps_repository.dart';
import 'package:mintstep/features/steps/domain/usecases/get_daily_steps.dart';

// Create mock repository class
class MockStepsRepository extends Mock implements StepsRepository {}

void main() {
  late GetDailySteps useCase;
  late MockStepsRepository mockStepsRepository;

  setUp(() {
    mockStepsRepository = MockStepsRepository();
    useCase = GetDailySteps(mockStepsRepository);
  });

  final tDate = DateTime(2026, 7, 21);
  final tStepCount = StepCount(
    id: 'test_id',
    count: 5000,
    date: tDate,
    caloriesBurned: 200.0,
    distanceKm: 3.75,
    isSynced: true,
  );

  test(
    'should get step count for the date from the repository',
    () async {
      // arrange
      when(() => mockStepsRepository.getDailySteps(any()))
          .thenAnswer((_) async => Right(tStepCount));

      // act
      final result = await useCase(tDate);

      // assert
      expect(result, Right(tStepCount));
      verify(() => mockStepsRepository.getDailySteps(tDate)).called(1);
      verifyNoMoreInteractions(mockStepsRepository);
    },
  );
}
