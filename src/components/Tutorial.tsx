/* eslint-disable react/no-unknown-property */
import React from 'react';

const Tutorial: React.FC = () => {
  return (
    <div className="tutorial">
      <br />
      &ldquo;<span className="bold">SPACESYNC</span>&ldquo; is an exciting
      obstacle game where you take control of a rocket and navigate through
      obstacles to achieve the highest score possible. <br />
      Each time a player plays the game, they contribute to the global jackpot
      by paying transaction fees. At the end of each week, the top three players
      with the highest scores share the jackpot, with 50 percent going to the
      first-place winner, 30 percent to the second-place winner, and 20 percent
      to the third-place winner. Players can play as many times as they want to
      increase their chances of winning. In case of a tie, the player who
      achieved the score first will have the higher ranking. <br />
      <br />
      It&apos;s important to note that the rewards are distributed in Ethereum,
      on the zkSync blockchain. This ensures complete transparency and maximum
      security in processing rewards for the winning players. <br />
      <br />
      After the jackpot is distributed every Sunday, the podium and all player
      scores are reset to zero, providing a fair opportunity for all players to
      win fantastic rewards in the following week. With its engaging gameplay
      and enticing rewards, "SPACESYNC" offers a thrilling experience for
      players who are up for the challenge.
      <br />
      <br />
    </div>
  );
};

export default Tutorial;
