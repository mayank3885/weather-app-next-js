"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import Mayank from "../../public/mayank.png";
import githubLogo from "../../public/github.png";
import linkedInLogo from "../../public/linkedin.png";

export default function About() {
  useEffect(() => {
    const main = document.querySelector("body");
    while (main?.classList?.length! > 0) {
      main?.classList.remove(main.classList.item(0)!);
    }
  });
  return (
    <div className="about">
      <Image src={Mayank} alt="Mayank" className="mayank" />
      <div className="content">
        <h2>Who is Mayank?</h2>
        <ul>
          <li>
            Mayank is a recent Engineering graduate with a keen interest in the MERN stack and its
            related technologies. He has gained valuable experience through internships at two
            distinct tech companies and is currently freelancing while working on various projects.
          </li>
          <li>
            In addition to his academic and professional pursuits, Mayank actively hones his skills
            by tackling competitive problems on platforms like LeetCode. He also dedicates his time
            to developing and deploying projects, showcasing them on his GitHub profile for public
            access and reference.
          </li>
        </ul>
        <div className="social">
          <Link href="https://github.com/mayank3885" target="blank">
            <Image src={githubLogo} className="github" alt="github" />
          </Link>
          <Link href="https://www.linkedin.com/in/mayank-makwana-792a461b9/" target="blank">
            <Image src={linkedInLogo} className="linkedin" alt="linked in" />
          </Link>
        </div>
      </div>
    </div>
  );
}
