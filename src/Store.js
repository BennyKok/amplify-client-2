
import { handleError, message } from './Utils'

export const supabase = window.supabase.createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_KEY,
    {
        detectSessionInUrl: true,
        autoRefreshToken: true,
        persistSession: true,
    } 
)

export async function LoadMorePackages(setPackages, packages) {
    let currentItemCount = 0;
    if (packages)
        currentItemCount = packages.length

    await GetPackage(setPackages, currentItemCount, packages)
}

export async function GetPackage(setPackages, offset, packages = null, perPage = 20) {
    let { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          user:users (
            name
          )
        `)
        .order('updated_at', { ascending: false })
        .range(offset, perPage - 1 + offset)

    handleError(error);

    if (!error) {
        if (offset > 0 && data.length == 0) {
            message("You are at the bottom 🚀");
            return;
        }

        if (packages)
            data = packages.concat(data)
        setPackages(data);
    }
}

export async function LoadMoreUserPackages(setPackages, packages, user) {
    if (!user) return

    let currentItemCount = 0;
    if (packages)
        currentItemCount = packages.length

    await GetUserPackage(setPackages, user, currentItemCount, packages)
}

export async function GetUserPackage(setUserPackages, user, offset = 0, packages = null, perPage = 20) {
    if (!user) return

    let { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          user:users (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .range(offset, perPage - 1 + offset)

    handleError(error);

    if (!error) {
        if (offset > 0 && data.length == 0) {
            message("You are at the bottom 🚀");
            return;
        }

        if (packages)
            data = packages.concat(data)
        setUserPackages(data);
    }
}