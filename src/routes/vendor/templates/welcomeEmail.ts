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

export function accountSuspended(username: string, status: string) {
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
            <h3>${status}</h3>
            </p>
              <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis nesciunt
            reiciendis cumque incidunt possimus nulla laudantium ab ullam reprehenderit
            debitis, illo consequatur unde dolor, omnis qui necessitatibus. Natus, ipsa
            tempora?
            </p>
  `;
}

export function accountDeactivated(username: string, status: string) {
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
            <h3>${status}</h3>
            </p>
              <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis nesciunt
            reiciendis cumque incidunt possimus nulla laudantium ab ullam reprehenderit
            debitis, illo consequatur unde dolor, omnis qui necessitatibus. Natus, ipsa
            tempora?
            </p>
  `;
}

export function accountActivated(username: string, status: string) {
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
            <h3>${status}</h3>
            </p>
              <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis nesciunt
            reiciendis cumque incidunt possimus nulla laudantium ab ullam reprehenderit
            debitis, illo consequatur unde dolor, omnis qui necessitatibus. Natus, ipsa
            tempora?
            </p>
  `;
}
