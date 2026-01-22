// Demo problems for revolutionary math platform

import { ErrorHuntingProblem } from '@/components/math/ErrorHuntingWorkspace';

export const quadraticExpansionProblem: ErrorHuntingProblem = {
    id: 'quadratic-expansion-trap',
    title: 'The Quadratic Expansion Trap',
    brokenSolution: '(x + 3)^2 = x^2 + 9',
    correctSolution: '(x + 3)^2 = x^2 + 6x + 9',
    realWorldContext: `A farmer has a square field of side length x meters. 
She wants to expand it by 3 meters on each side. 
She calculates the new area as x² + 9. Is she correct?`,
    whyItMatters: `This is one of the most common mistakes in algebra! 
Understanding why (a+b)² ≠ a² + b² is crucial for:
• Factoring quadratics
• Completing the square
• Solving optimization problems
• Understanding parabolic motion in physics`,
    errors: [
        {
            id: '1',
            location: { start: 12, end: 19 },
            type: 'missing_term',
            explanation: `The middle term 6x is missing! When you expand (x+3)², 
you get (x+3)(x+3) = x² + 3x + 3x + 9 = x² + 6x + 9`,
            hint: 'Use FOIL: First, Outer, Inner, Last. What happens to the Outer and Inner terms?',
            counterexample: 'Try x = 1: (1+3)² = 16, but 1² + 9 = 10. Where did the 6 go?',
        },
        {
            id: '2',
            location: { start: 12, end: 19 },
            type: 'wrong_formula',
            explanation: `This assumes (a+b)² = a² + b², which is FALSE! 
The correct formula is (a+b)² = a² + 2ab + b²`,
            hint: 'Think geometrically: if you expand a square, you add strips on the sides, not just corners!',
        },
    ],
};

export const signErrorProblem: ErrorHuntingProblem = {
    id: 'distribution-sign-error',
    title: 'The Distribution Sign Trap',
    brokenSolution: '-2(x - 3) = -2x - 6',
    correctSolution: '-2(x - 3) = -2x + 6',
    realWorldContext: `You're calculating the change in temperature. 
It drops by 2 degrees every hour for (x - 3) hours. 
The total change is -2(x - 3). What's the simplified form?`,
    whyItMatters: `Sign errors are the #1 cause of wrong answers in algebra! 
This mistake appears in:
• Solving equations
• Factoring expressions
• Simplifying complex fractions
• Calculus derivatives`,
    errors: [
        {
            id: '1',
            location: { start: 13, end: 19 },
            type: 'wrong_sign',
            explanation: `When distributing -2 over (x - 3), you must multiply BOTH terms by -2.
-2 × (-3) = +6, not -6!`,
            hint: 'Remember: negative times negative equals positive!',
            counterexample: 'Try x = 5: -2(5-3) = -2(2) = -4, but -2(5) - 6 = -16. Big difference!',
        },
    ],
};

export const squareRootParadox: ErrorHuntingProblem = {
    id: 'square-root-paradox',
    title: 'The Square Root Paradox',
    brokenSolution: '\\sqrt{(-3)^2} = -3',
    correctSolution: '\\sqrt{(-3)^2} = 3',
    realWorldContext: `You're calculating the distance a ball traveled. 
It moved -3 meters (backward). The distance is √((-3)²). 
Someone claims the distance is -3 meters. Can distance be negative?`,
    whyItMatters: `Understanding that √(x²) = |x| (absolute value) is crucial for:
• Distance calculations
• Pythagorean theorem
• Complex numbers
• Understanding why some equations have no real solutions`,
    errors: [
        {
            id: '1',
            location: { start: 0, end: 15 },
            type: 'wrong_formula',
            explanation: `√(x²) always gives the POSITIVE value (absolute value).
(-3)² = 9, and √9 = 3 (positive).
The square root "forgets" the original sign!`,
            hint: 'Squaring destroys information about the sign. The square root can\'t recover it!',
            counterexample: 'Both 3² and (-3)² equal 9. So √9 must be positive to have one answer.',
        },
    ],
};

export const pythagoreanSurprise: ErrorHuntingProblem = {
    id: 'pythagorean-surprise',
    title: 'The Pythagorean Surprise',
    brokenSolution: '\\sqrt{3^2 + 4^2} = 3 + 4 = 7',
    correctSolution: '\\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5',
    realWorldContext: `You walk 3 km east, then 4 km north. 
Someone claims the straight-line distance back home is 3 + 4 = 7 km. 
Is that right?`,
    whyItMatters: `This reveals why √(a² + b²) ≠ a + b:
• Pythagorean theorem in geometry
• Distance formula in coordinate geometry
• Magnitude of vectors in physics
• Understanding why shortcuts are shorter!`,
    errors: [
        {
            id: '1',
            location: { start: 0, end: 23 },
            type: 'wrong_formula',
            explanation: `You can't "distribute" the square root over addition!
√(a² + b²) ≠ √(a²) + √(b²) = a + b
You must add FIRST, then take the square root.`,
            hint: 'Think about it: if this worked, the hypotenuse would always be longer than the sum of the legs!',
            counterexample: 'The actual distance is 5 km, not 7 km. The shortcut saves you 2 km!',
        },
    ],
};

export const allProblems = [
    quadraticExpansionProblem,
    signErrorProblem,
    squareRootParadox,
    pythagoreanSurprise,
];
