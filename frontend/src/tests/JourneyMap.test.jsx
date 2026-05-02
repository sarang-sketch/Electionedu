import React, { useState } from 'react';
import { Map, Flag, Users, CheckSquare, BarChart, Award } from 'lucide-react';

const journeySteps = [
  {
    id: 1,
    title: "Voter Registration",
    icon: <Users size={24} aria-hidden="true" />,
    description: "Eligible citizens register to vote to be included in the electoral roll. This is the foundation of the democratic process."
  },
  {
    id: 2,
    title: "Campaigning",
    icon: <Flag size={24} aria-hidden="true" />,
    description: "Candidates and political parties share their manifestos, organize rallies, and debate to win the support of the electorate."
  },
  {
    id: 3,
    title: "Voting Day",
    icon: <CheckSquare size={24} aria-hidden="true" />,
    description: "Registered voters go to polling stations to cast their ballots, typically using electronic voting machines (EVMs) or paper ballots."
  },
  {
    id: 4,
    title: "Counting",
    icon: <BarChart size={24} aria-hidden="true" />,
    description: "Votes are securely transported and counted under strict supervision by election commission officials and party representatives."
  },
  {
    id: 5,
    title: "Results & Inauguration",
    icon: <Award size={24} aria-hidden="true" />,
    description: "The winner is declared based on the counting results. The elected officials are then sworn into office to form the new government."
  }
];

export default function JourneyMap() {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <main className="card animate-fade-in" role="main" aria-label="Interactive Election Journey Map">
      <h2 id="journey-heading">Interactive Election Journey Map</h2>
      <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        Click on each step to learn more about the election process timeline.
      </p>

      <div 
        role="list"
        aria-labelledby="journey-heading"
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {journeySteps.map((step, index) => (
          <div
            key={step.id}
            role="listitem"
            style={{
              border: `2px solid ${activeStep === step.id ? 'var(--secondary-color)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius)',
              padding: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: activeStep === step.id ? 'rgba(26, 115, 232, 0.05)' : 'white'
            }}
            onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveStep(activeStep === step.id ? null : step.id);
              }
            }}
            tabIndex={0}
            aria-expanded={activeStep === step.id}
            aria-controls={`step-detail-${step.id}`}
            aria-label={`Step ${index + 1}: ${step.title}. ${activeStep === step.id ? 'Click to collapse' : 'Click to expand'}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                backgroundColor: activeStep === step.id ? 'var(--secondary-color)' : 'var(--bg-color)',
                color: activeStep === step.id ? 'white' : 'var(--text-primary)',
                padding: '0.75rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {step.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: activeStep === step.id ? 'var(--secondary-color)' : 'var(--primary-color)' }}>
                  Step {index + 1}: {step.title}
                </h3>
              </div>
              <div 
                aria-hidden="true"
                style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--border-color)' }}
              >
                {activeStep === step.id ? '-' : '+'}
              </div>
            </div>

            {activeStep === step.id && (
              <div 
                id={`step-detail-${step.id}`}
                role="region"
                aria-label={`Details for ${step.title}`}
                style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                {step.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}