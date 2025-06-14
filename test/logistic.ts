const code1 = `
in = [r, k]
r { 1 }
k { 1 }
u_i {
    y = 1,
    z = 0,
}
dudt_i {
    dydt = 0,
    dzdt = 0,
}
F_i {
    dydt,
    0,
}
G_i {
    (r * y) * (1 - (y / k)),
    (2 * y) - z,
}
out_i {
    y,
    z,
}`;

const code2 = `
in = [r, k]
r { 1 }
k { 1 }
u_i {
    y = 1,
    z = 0,
}
dudt_i {
    dydt = 0,
    dzdt = 0,
}
F_i {
    dydt,
    0,
}
G_i {
    (r * y) * (1 - (y / k)),
    (y * z) - (k * z),
}
out_i {
    y,
    z,
}`;

export { code1, code2 };