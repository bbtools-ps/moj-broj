import { faRandom, faSearch, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import { findSolution, generateRandomNumber, pickRandomNumber } from './utils';

export default function App() {
  const [targetNumber, setTargetNumber] = useState<string>('');
  const [availableNumbers, setAvailableNumbers] = useState<string[]>([]);
  const [solution, setSolution] = useState<{
    result: number;
    solution: string;
  }>();

  const handleGenerateRandomNumbers = () => {
    setTargetNumber(generateRandomNumber().toString());

    const randomNumbers = [];

    for (let i = 0; i < 4; i++) {
      randomNumbers.push(generateRandomNumber(1, 9).toString());
    }
    randomNumbers.push(pickRandomNumber([10, 15, 20]).toString());
    randomNumbers.push(pickRandomNumber([25, 50, 75, 100]).toString());

    setAvailableNumbers(randomNumbers);
    setSolution(undefined);
  };

  const handleReset = () => {
    setTargetNumber('');
    setAvailableNumbers(['', '', '', '', '', '']);
    setSolution(undefined);
  };

  const handleFindSolution = () => {
    const nums = availableNumbers
      .map((n) => parseInt(n))
      .filter((n) => !isNaN(n));
    const target = parseInt(targetNumber);

    if (isNaN(target) || nums.length === 0) return;

    const solution = findSolution(nums, target);
    setSolution(solution);
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 -z-10 bg-[url(/bg.webp)] bg-cover bg-center opacity-25" />
      <div className="absolute inset-0 -z-20 bg-[#119ef5]" />
      <div className="flex h-full w-full flex-col gap-6 overflow-auto p-4">
        <h1 className="my-10 text-center text-5xl font-bold text-[#031572]">
          Moj broj
        </h1>
        <div className="mx-auto">
          <Input
            showStepper={false}
            value={targetNumber}
            max={999}
            onChange={(value) => {
              setTargetNumber(value);
            }}
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Input
            value={availableNumbers[0] ?? ''}
            onChange={(value) => {
              setAvailableNumbers((prev) => {
                const newNumbers = [...prev];
                newNumbers[0] = value;
                return newNumbers;
              });
            }}
            max={9}
            placeholder="1-9"
          />
          <Input
            value={availableNumbers[1] ?? ''}
            onChange={(value) => {
              setAvailableNumbers((prev) => {
                const newNumbers = [...prev];
                newNumbers[1] = value;
                return newNumbers;
              });
            }}
            max={9}
            placeholder="1-9"
          />
          <Input
            value={availableNumbers[2] ?? ''}
            onChange={(value) => {
              setAvailableNumbers((prev) => {
                const newNumbers = [...prev];
                newNumbers[2] = value;
                return newNumbers;
              });
            }}
            max={9}
            placeholder="1-9"
          />
          <Input
            value={availableNumbers[3] ?? ''}
            onChange={(value) => {
              setAvailableNumbers((prev) => {
                const newNumbers = [...prev];
                newNumbers[3] = value;
                return newNumbers;
              });
            }}
            max={9}
            placeholder="1-9"
          />
          <Input
            value={availableNumbers[4] ?? ''}
            onChange={(value) => {
              setAvailableNumbers((prev) => {
                const newNumbers = [...prev];
                newNumbers[4] = value;
                return newNumbers;
              });
            }}
            allowedValues={[10, 15, 20]}
            placeholder="10, 15, 20"
          />
          <Input
            value={availableNumbers[5] ?? ''}
            onChange={(value) => {
              setAvailableNumbers((prev) => {
                const newNumbers = [...prev];
                newNumbers[5] = value;
                return newNumbers;
              });
            }}
            allowedValues={[25, 50, 75, 100]}
            placeholder="25, 50, 75, 100"
          />
        </div>
        <div className="mx-auto w-full max-w-xl rounded-md border-2 border-[#9d9fa5] bg-[#031572] p-3 text-center text-2xl font-medium text-white outline-2 outline-[#031572] focus:outline">
          <p>
            <strong>{solution?.result ?? '\u00A0'}</strong>
          </p>
          <p className="text-amber-300">{solution?.solution ?? '\u00A0'}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={handleGenerateRandomNumbers}>
            <FontAwesomeIcon icon={faRandom} /> Izmešaj
          </Button>
          <Button onClick={handleReset}>
            <FontAwesomeIcon icon={faUndo} />
            Resetuj
          </Button>
          <Button onClick={handleFindSolution}>
            <FontAwesomeIcon icon={faSearch} />
            Rešenje
          </Button>
        </div>
      </div>
    </div>
  );
}
