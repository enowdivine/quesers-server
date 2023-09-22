export function emailVerification(username: string, url: string) {
  return `
            <h3>Hi ${username},</h3>
            <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis nesciunt
            reiciendis cumque incidunt possimus nulla laudantium ab ullam reprehenderit
            debitis, illo consequatur unde dolor, omnis qui necessitatibus. Natus, ipsa
            tempora?
            </p>
            <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis nesciunt
            <a href="${url}">Click here</a>
            </p>
            <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis nesciunt
            reiciendis cumque incidunt possimus nulla laudantium ab ullam reprehenderit
            debitis, illo consequatur unde dolor, omnis qui necessitatibus. Natus, ipsa
            tempora?
            </p>
  `;
}

export function welcomeEmail(username: string) {
  return `
            <h3>Hi ${username},</h3>
            <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis nesciunt
            reiciendis cumque incidunt possimus nulla laudantium ab ullam reprehenderit
            debitis, illo consequatur unde dolor, omnis qui necessitatibus. Natus, ipsa
            tempora?
            </p>
              <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis nesciunt
            reiciendis cumque incidunt possimus nulla laudantium ab ullam reprehenderit
            debitis, illo consequatur unde dolor, omnis qui necessitatibus. Natus, ipsa
            tempora?
            </p>
  `;
}

export function forgotPasswordEmail(username: string, url: string) {
  return `
            <h3>Hi ${username},</h3>
            <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis nesciunt
            reiciendis cumque incidunt possimus nulla laudantium ab ullam reprehenderit
            debitis, illo consequatur unde dolor, omnis qui necessitatibus. Natus, ipsa
            tempora?
            </p>
              <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis nesciunt
             <a href="${url}">Click here</a>
            </p>
              <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis nesciunt
            reiciendis cumque incidunt possimus nulla laudantium ab ullam reprehenderit
            debitis, illo consequatur unde dolor, omnis qui necessitatibus. Natus, ipsa
            tempora?
            </p>
  `;
}