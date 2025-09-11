const code = `
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
M_i {
    dydt,
    0,
}
F_i {
    (r * y) * (1 - (y / k)),
    (2 * y) - z,
}
out_i {
    y,
    z,
}`;

export default code;